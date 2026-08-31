import { CareerNode, CareerEvent, VaultKey, GeneratedResume } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`API Error [${response.status}] ${endpoint}: ${errorBody}`);
  }
  return response.json();
}

export const api = {
  // Health
  checkHealth: async () => {
    const url = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/v1$/, '') + '/healthz';
    const res = await fetch(url);
    return res.json();
  },

  // Career Events & Graph Nodes
  getCareerNodes: async (): Promise<CareerNode[]> => {
    return request<CareerNode[]>('/career-nodes');
  },

  createCareerNode: async (node: Partial<CareerNode>): Promise<CareerNode> => {
    return request<CareerNode>('/career-nodes', {
      method: 'POST',
      body: JSON.stringify(node),
    });
  },

  deleteCareerNode: async (id: string): Promise<{ success: boolean }> => {
    return request<{ success: boolean }>(`/career-nodes/${id}`, {
      method: 'DELETE',
    });
  },

  postCareerEvent: async (rawText: string, captureChannel: string): Promise<CareerEvent> => {
    return request<CareerEvent>('/career-events', {
      method: 'POST',
      body: JSON.stringify({ raw_text: rawText, capture_channel: captureChannel }),
    });
  },

  getCareerEvent: async (id: string): Promise<CareerEvent> => {
    return request<CareerEvent>(`/career-events/${id}`);
  },

  // BYOK Vault
  getVaultKeys: async (): Promise<VaultKey[]> => {
    return request<VaultKey[]>('/vault/keys');
  },

  saveVaultKey: async (provider: string, apiKey: string): Promise<VaultKey> => {
    return request<VaultKey>('/vault/keys', {
      method: 'POST',
      body: JSON.stringify({ provider, api_key: apiKey }),
    });
  },

  deleteVaultKey: async (provider: string): Promise<{ success: boolean }> => {
    return request<{ success: boolean }>(`/vault/keys/${provider}`, {
      method: 'DELETE',
    });
  },

  // Resume Generation
  generateResume: async (rawJD: string, templateId: string): Promise<GeneratedResume> => {
    return request<GeneratedResume>('/resume/generate', {
      method: 'POST',
      body: JSON.stringify({ raw_jd: rawJD, template_id: templateId }),
    });
  },
};
