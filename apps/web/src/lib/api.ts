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
  // Auth & Token Rotation
  login: async (email: string, name?: string): Promise<AuthSession> => {
    const data = await request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    }, false);
    setTokens(data.access_token, data.refresh_token);
    return { accessToken: data.access_token, refreshToken: data.refresh_token, user: data.user };
  },

  logout: async (): Promise<void> => {
    if (currentRefreshToken) {
      await request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: currentRefreshToken }),
      }, false).catch(() => {});
    }
    setTokens(null, null);
  },

  getMe: async (): Promise<User> => {
    return request<User>('/auth/me');
  },

  refreshSession: async (): Promise<string | null> => {
    return executeRefresh();
  },

  // Career Graph
  getCareerNodes: async (): Promise<CareerNode[]> => request<CareerNode[]>('/career-nodes'),
  createCareerNode: async (node: Partial<CareerNode>): Promise<CareerNode> => request<CareerNode>('/career-nodes', { method: 'POST', body: JSON.stringify(node) }),
  deleteCareerNode: async (id: string): Promise<{ success: boolean }> => request<{ success: boolean }>(`/career-nodes/${id}`, { method: 'DELETE' }),
  postCareerEvent: async (rawText: string, captureChannel: string): Promise<CareerEvent> => request<CareerEvent>('/career-events', { method: 'POST', body: JSON.stringify({ raw_text: rawText, capture_channel: captureChannel }) }),

  // BYOK Vault
  getVaultKeys: async (): Promise<VaultKey[]> => request<VaultKey[]>('/vault/keys'),
  saveVaultKey: async (provider: string, apiKey: string): Promise<VaultKey> => request<VaultKey>('/vault/keys', { method: 'POST', body: JSON.stringify({ provider, api_key: apiKey }) }),
  deleteVaultKey: async (provider: string): Promise<{ success: boolean }> => request<{ success: boolean }>(`/vault/keys/${provider}`, { method: 'DELETE' }),

  // Resume Generation
  generateResume: async (rawJD: string, templateId: string): Promise<GeneratedResume> => request<GeneratedResume>('/resumes/generate', { method: 'POST', body: JSON.stringify({ raw_jd: rawJD, template_id: templateId }) }),
};
