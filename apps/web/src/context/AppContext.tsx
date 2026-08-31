'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  CareerEvent,
  CareerNode,
  JobDescription,
  GeneratedResume,
  MockupConfig,
  PortfolioConfig,
  VaultKey,
  LLMExecution,
} from '../lib/types';
import {
  INITIAL_CAREER_EVENTS,
  INITIAL_CAREER_NODES,
  INITIAL_JOB_DESCRIPTION,
  INITIAL_GENERATED_RESUME,
  INITIAL_MOCKUP_CONFIG,
  INITIAL_PORTFOLIO_CONFIG,
  INITIAL_VAULT_KEYS,
  INITIAL_LLM_EXECUTIONS,
} from '../lib/mockData';

interface AppContextValue {
  events: CareerEvent[];
  nodes: CareerNode[];
  addEvent: (text: string, channel: CareerEvent['captureChannel']) => void;
  deleteNode: (id: string) => void;
  addNode: (node: Omit<CareerNode, 'id' | 'createdAt' | 'updatedAt'>) => void;
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
  saveVaultKey: (provider: VaultKey['provider'], key: string) => void;
  executions: LLMExecution[];
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CareerEvent[]>(INITIAL_CAREER_EVENTS);
  const [nodes, setNodes] = useState<CareerNode[]>(INITIAL_CAREER_NODES);
  const [jobDescription, setJobDescription] = useState<JobDescription>(INITIAL_JOB_DESCRIPTION);
  const [resume, setResume] = useState<GeneratedResume>(INITIAL_GENERATED_RESUME);
  const [mockup, setMockup] = useState<MockupConfig>(INITIAL_MOCKUP_CONFIG);
  const [portfolio, setPortfolio] = useState<PortfolioConfig>(INITIAL_PORTFOLIO_CONFIG);
  const [vaultKeys, setVaultKeys] = useState<VaultKey[]>(INITIAL_VAULT_KEYS);
  const [executions, setExecutions] = useState<LLMExecution[]>(INITIAL_LLM_EXECUTIONS);

  const addEvent = (text: string, channel: CareerEvent['captureChannel']) => {
    const newId = `evt-${Date.now()}`;
    const newEvent: CareerEvent = {
      id: newId,
      userId: 'user-1',
      rawText: text,
      captureChannel: channel,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [newEvent, ...prev]);

    // Simulate async structuring worker
    setTimeout(() => {
      setEvents((prev) =>
        prev.map((e) => (e.id === newId ? { ...e, status: 'completed', processedAt: new Date().toISOString() } : e))
      );
      const newNode: CareerNode = {
        id: `node-${Date.now()}`,
        userId: 'user-1',
        nodeType: 'achievement',
        title: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
        situationTask: 'Captured via Karma ' + channel,
        action: text,
        result: 'Processed into structured graph node with vector embedding.',
        metrics: { scale: '1 node structured' },
        tags: ['AutoStructured', 'WorkCompounded'],
        source: channel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNodes((prev) => [newNode, ...prev]);
      const newExec: LLMExecution = {
        id: `exec-${Date.now()}`,
        module: 'career_node_structuring',
        executionMode: 'byok',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20241022',
        promptTokens: 820,
        completionTokens: 210,
        costUsd: 0.0056,
        cacheHit: false,
        status: 'success',
        latencyMs: 720,
        createdAt: new Date().toISOString(),
      };
      setExecutions((prev) => [newExec, ...prev]);
    }, 2000);
  };

  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const addNode = (node: Omit<CareerNode, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNode: CareerNode = {
      ...node,
      id: `node-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNodes((prev) => [newNode, ...prev]);
  };

  const toggleResumeBullet = (nodeId: string) => {
    setResume((prev) => {
      const updated = prev.bullets.map((b) =>
        b.careerNodeId === nodeId ? { ...b, included: !b.included } : b
      );
      const includedChars = updated
        .filter((b) => b.included)
        .reduce((sum, b) => sum + b.finalText.length, 0);
      return {
        ...prev,
        bullets: updated,
        characterCount: includedChars,
      };
    });
  };

  const toggleVaultKey = (id: string) => {
    setVaultKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, isActive: !k.isActive } : k))
    );
  };

  const saveVaultKey = (provider: VaultKey['provider'], key: string) => {
    const last4 = key.slice(-4) || '0000';
    setVaultKeys((prev) =>
      prev.map((k) =>
        k.provider === provider
          ? { ...k, keyLast4: last4, isActive: true, validatedAt: new Date().toISOString() }
          : k
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        events,
        nodes,
        addEvent,
        deleteNode,
        addNode,
        jobDescription,
        setJobDescription,
        resume,
        toggleResumeBullet,
        mockup,
        setMockup,
        portfolio,
        setPortfolio,
        vaultKeys,
        toggleVaultKey,
        saveVaultKey,
        executions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
