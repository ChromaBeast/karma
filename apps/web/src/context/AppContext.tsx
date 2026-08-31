'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CareerEvent, CareerNode, JobDescription, GeneratedResume, MockupConfig, PortfolioConfig, VaultKey, LLMExecution } from '../lib/types';
import { api } from '../lib/api';
import { defaultJobDescription, defaultResume, defaultMockup, defaultPortfolio } from './defaultState';

interface AppContextValue {
  events: CareerEvent[];
  nodes: CareerNode[];
  addEvent: (text: string, channel: CareerEvent['captureChannel']) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
  addNode: (node: Omit<CareerNode, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  jobDescription: JobDescription;
  setJobDescription: React.Dispatch<React.SetStateAction<JobDescription>>;
  resume: GeneratedResume;
  toggleResumeBullet: (nodeId: string) => void;
  mockup: MockupConfig;
  setMockup: React.Dispatch<React.SetStateAction<MockupConfig>>;
  portfolio: PortfolioConfig;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioConfig>>;
  vaultKeys: VaultKey[];
  toggleVaultKey: (id: string) => void;
  saveVaultKey: (provider: VaultKey['provider'], key: string) => Promise<void>;
  executions: LLMExecution[];
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CareerEvent[]>([]);
  const [nodes, setNodes] = useState<CareerNode[]>([]);
  const [vaultKeys, setVaultKeys] = useState<VaultKey[]>([]);
  const [executions] = useState<LLMExecution[]>([]);

  const [jobDescription, setJobDescription] = useState<JobDescription>(defaultJobDescription);
  const [resume, setResume] = useState<GeneratedResume>(defaultResume);
  const [mockup, setMockup] = useState<MockupConfig>(defaultMockup);
  const [portfolio, setPortfolio] = useState<PortfolioConfig>(defaultPortfolio);

  const refreshData = useCallback(async () => {
    try {
      const [fetchedNodes, fetchedKeys] = await Promise.all([
        api.getCareerNodes().catch(() => []),
        api.getVaultKeys().catch(() => []),
      ]);
      if (fetchedNodes && Array.isArray(fetchedNodes)) setNodes(fetchedNodes);
      if (fetchedKeys && Array.isArray(fetchedKeys)) setVaultKeys(fetchedKeys);
    } catch {
      // Graceful fallback
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addEvent = async (text: string, channel: CareerEvent['captureChannel']) => {
    try {
      const created = await api.postCareerEvent(text, channel);
      setEvents((prev) => [created, ...prev]);
      setTimeout(async () => { await refreshData(); }, 1200);
    } catch {
      const fallbackNode: CareerNode = {
        id: `node-${Date.now()}`,
        userId: 'usr-1',
        nodeType: 'achievement',
        title: text.slice(0, 50),
        action: text,
        result: 'Captured into graph.',
        metrics: { scale: '1 node' },
        tags: ['RealData', 'CareerGraph'],
        source: channel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNodes((prev) => [fallbackNode, ...prev]);
    }
  };

  const deleteNode = async (id: string) => {
    try { await api.deleteCareerNode(id); } catch { /* ignore */ }
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const addNode = async (node: Omit<CareerNode, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await api.createCareerNode(node);
      setNodes((prev) => [created, ...prev]);
    } catch {
      setNodes((prev) => [...prev, { ...node, id: `node-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
  };

  const toggleResumeBullet = (nodeId: string) => {
    setResume((prev) => {
      const updated = prev.bullets.map((b) => b.careerNodeId === nodeId ? { ...b, included: !b.included } : b);
      const chars = updated.filter((b) => b.included).reduce((sum, b) => sum + b.finalText.length, 0);
      return { ...prev, bullets: updated, characterCount: chars };
    });
  };

  const toggleVaultKey = (id: string) => {
    setVaultKeys((prev) => prev.map((k) => (k.id === id ? { ...k, isActive: !k.isActive } : k)));
  };

  const saveVaultKey = async (provider: VaultKey['provider'], key: string) => {
    try {
      const saved = await api.saveVaultKey(provider, key);
      setVaultKeys((prev) => [...prev.filter((k) => k.provider !== provider), saved]);
    } catch {
      const last4 = key.slice(-4) || '0000';
      setVaultKeys((prev) => [
        ...prev.filter((k) => k.provider !== provider),
        { id: `key-${Date.now()}`, provider, keyLast4: last4, isActive: true, model: 'production-default' },
      ]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        events, nodes, addEvent, deleteNode, addNode,
        jobDescription, setJobDescription, resume, toggleResumeBullet,
        mockup, setMockup, portfolio, setPortfolio,
        vaultKeys, toggleVaultKey, saveVaultKey, executions, refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
