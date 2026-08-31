import { CareerNode, CareerEvent, VaultKey, GeneratedResume, User } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}

let currentAccessToken: string | null = null;
let currentRefreshToken: string | null = null;

if (typeof window !== 'undefined') {
  currentAccessToken = localStorage.getItem('karma_access_token');
  currentRefreshToken = localStorage.getItem('karma_refresh_token');
}

export function setTokens(access: string | null, refresh: string | null) {
  currentAccessToken = access;
  currentRefreshToken = refresh;
  if (typeof window !== 'undefined') {
    if (access) localStorage.setItem('karma_access_token', access);
    else localStorage.removeItem('karma_access_token');
    if (refresh) localStorage.setItem('karma_refresh_token', refresh);
    else localStorage.removeItem('karma_refresh_token');
  }
}

export function getStoredTokens() {
  return { accessToken: currentAccessToken, refreshToken: currentRefreshToken };
}

let refreshPromise: Promise<string | null> | null = null;

async function executeRefresh(): Promise<string | null> {
  if (!currentRefreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: currentRefreshToken }),
    });
    if (!res.ok) {
      setTokens(null, null);
      return null;
    }
    const data = await res.json();
    setTokens(data.access_token, data.refresh_token);
    return data.access_token;
  } catch {
    setTokens(null, null);
    return null;
  } finally {
    refreshPromise = null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}, retry = true): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (currentAccessToken) {
    headers['Authorization'] = `Bearer ${currentAccessToken}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && retry && currentRefreshToken) {
    if (!refreshPromise) refreshPromise = executeRefresh();
    const newAccessToken = await refreshPromise;
    if (newAccessToken) {
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      const retryRes = await fetch(url, { ...options, headers });
      if (!retryRes.ok) {
        const errorBody = await retryRes.text().catch(() => 'Unknown error');
        throw new Error(`API Error [${retryRes.status}] ${endpoint}: ${errorBody}`);
      }
      return retryRes.json();
    }
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`API Error [${response.status}] ${endpoint}: ${errorBody}`);
  }
  return response.json();
}

export const api = {
  // 1. Auth & Session
  login: async (email: string, password?: string, name?: string): Promise<AuthSession> => {
    const data = await request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, name }) }, false);
    setTokens(data.access_token, data.refresh_token);
    return { accessToken: data.access_token, refreshToken: data.refresh_token, user: data.user };
  },
  logout: async (): Promise<void> => {
    if (currentRefreshToken) {
      await request('/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token: currentRefreshToken }) }, false).catch(() => {});
    }
    setTokens(null, null);
  },
  getMe: async (): Promise<User> => request<User>('/auth/me'),
  refreshSession: async (): Promise<string | null> => executeRefresh(),

  // 2. Career Graph & Events
  getCareerNodes: async (): Promise<CareerNode[]> => request<CareerNode[]>('/career-nodes'),
  createCareerNode: async (node: Partial<CareerNode>): Promise<CareerNode> => request<CareerNode>('/career-nodes', { method: 'POST', body: JSON.stringify(node) }),
  deleteCareerNode: async (id: string): Promise<{ success: boolean }> => request<{ success: boolean }>(`/career-nodes/${id}`, { method: 'DELETE' }),
  postCareerEvent: async (rawText: string, captureChannel: string): Promise<CareerEvent> => request<CareerEvent>('/career-events', { method: 'POST', body: JSON.stringify({ raw_text: rawText, capture_channel: captureChannel }) }),

  // 3. BYOK Vault
  getVaultKeys: async (): Promise<VaultKey[]> => request<VaultKey[]>('/vault/keys'),
  saveVaultKey: async (provider: string, apiKey: string): Promise<VaultKey> => request<VaultKey>('/vault/keys', { method: 'POST', body: JSON.stringify({ provider, api_key: apiKey }) }),
  deleteVaultKey: async (provider: string): Promise<{ success: boolean }> => request<{ success: boolean }>(`/vault/keys/${provider}`, { method: 'DELETE' }),

  // 4. ATS Resumes
  generateResume: async (rawJD: string, templateId: string): Promise<GeneratedResume> => request<GeneratedResume>('/resumes/generate', { method: 'POST', body: JSON.stringify({ raw_jd: rawJD, template_id: templateId }) }),
  getResumes: async (): Promise<GeneratedResume[]> => request<GeneratedResume[]>('/resumes'),

  // 5. Portfolio CMS
  getPortfolio: async (): Promise<any> => request<any>('/portfolios/me'),
  upsertPortfolio: async (themeId: string, subdomain: string, config: any): Promise<any> => request<any>('/portfolios', { method: 'POST', body: JSON.stringify({ theme_id: themeId, subdomain, config }) }),
  publishPortfolio: async (): Promise<any> => request<any>('/portfolios/publish', { method: 'PUT' }),
  setPortfolioProjects: async (careerNodeIds: string[]): Promise<any> => request<any>('/portfolios/projects', { method: 'POST', body: JSON.stringify({ career_node_ids: careerNodeIds }) }),

  // 6. Proof Mockups
  generateMockup: async (sourceImageUrl: string, assetType = 'device_frame', params = {}): Promise<any> => request<any>('/mockups/generate', { method: 'POST', body: JSON.stringify({ source_image_url: sourceImageUrl, asset_type: assetType, params }) }),
  getMockups: async (): Promise<any[]> => request<any[]>('/mockups'),

  // 7. Career Acceleration Tools
  generateHeadline: async (roleTitle: string, topSkills: string): Promise<any> => request<any>('/tools/linkedin/headline', { method: 'POST', body: JSON.stringify({ role_title: roleTitle, top_skills: topSkills }) }),
  generatePost: async (projectTitle: string, metricsResult: string): Promise<any> => request<any>('/tools/linkedin/post', { method: 'POST', body: JSON.stringify({ project_title: projectTitle, metrics_result: metricsResult }) }),
  startInterview: async (domain: string, roleTitle: string): Promise<any> => request<any>('/tools/interview/start', { method: 'POST', body: JSON.stringify({ domain, role_title: roleTitle }) }),
  submitInterviewAnswer: async (sessionId: string, answer: string): Promise<any> => request<any>('/tools/interview/answer', { method: 'POST', body: JSON.stringify({ session_id: sessionId, answer }) }),
  generateCoverLetter: async (company: string, roleTitle: string, jdId?: string): Promise<any> => request<any>('/tools/cover-letter', { method: 'POST', body: JSON.stringify({ company, role_title: roleTitle, job_description_id: jdId }) }),
  generateOutreach: async (channel: string, company: string, roleTitle: string, contactName: string): Promise<any> => request<any>('/tools/outreach', { method: 'POST', body: JSON.stringify({ channel, company, role_title: roleTitle, contact_name: contactName }) }),
  analyzeSkillGap: async (jdId?: string): Promise<any> => request<any>('/tools/skill-gap', { method: 'POST', body: JSON.stringify({ job_description_id: jdId }) }),

  // 8. LLM Router & Credits
  getCredits: async (): Promise<{ balance: number }> => request<{ balance: number }>('/llm/credits'),
  executeLLM: async (prompt: string, provider: string, model: string): Promise<any> => request<any>('/llm/execute', { method: 'POST', body: JSON.stringify({ prompt, provider, model }) }),
};
