import {
  CareerEvent,
  VaultKey,
  LLMExecution,
  MockupConfig,
  PortfolioConfig,
  JobDescription,
  GeneratedResume,
} from './types';
import { INITIAL_CAREER_NODES } from './mockNodes';

export { INITIAL_CAREER_NODES };

export const INITIAL_CAREER_EVENTS: CareerEvent[] = [
  {
    id: 'evt-101',
    userId: 'user-1',
    rawText: 'Shipped dynamic egress router reducing p99 latency by 42% across 12 availability zones.',
    captureChannel: 'quick_add',
    status: 'completed',
    careerNodeId: 'node-1',
    createdAt: '2024-01-15T09:55:00Z',
    processedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt-102',
    userId: 'user-1',
    rawText: 'Benchmarked HNSW vector index in Postgres under 5ms for 10M records with SIMD quantization.',
    captureChannel: 'slack_bot',
    status: 'completed',
    careerNodeId: 'node-2',
    createdAt: '2024-02-10T14:28:00Z',
    processedAt: '2024-02-10T14:30:00Z',
  },
];

export const INITIAL_VAULT_KEYS: VaultKey[] = [
  {
    id: 'key-1',
    provider: 'anthropic',
    keyLast4: '8829',
    isActive: true,
    model: 'claude-3-5-sonnet-20241022',
    validatedAt: '2024-05-01T12:00:00Z',
  },
  {
    id: 'key-2',
    provider: 'openai',
    keyLast4: '4190',
    isActive: true,
    model: 'gpt-4o',
    validatedAt: '2024-05-02T15:30:00Z',
  },
  {
    id: 'key-3',
    provider: 'gemini',
    keyLast4: '9931',
    isActive: false,
    model: 'gemini-1.5-pro',
  },
];

export const INITIAL_LLM_EXECUTIONS: LLMExecution[] = [
  {
    id: 'exec-1',
    module: 'resume_structuring',
    executionMode: 'byok',
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    promptTokens: 1420,
    completionTokens: 380,
    costUsd: 0.0098,
    cacheHit: false,
    status: 'success',
    latencyMs: 840,
    createdAt: '2024-05-08T10:12:00Z',
  },
  {
    id: 'exec-2',
    module: 'ats_knapsack_rank',
    executionMode: 'byok',
    provider: 'openai',
    model: 'gpt-4o',
    promptTokens: 2100,
    completionTokens: 520,
    costUsd: 0.0182,
    cacheHit: true,
    status: 'success',
    latencyMs: 140,
    createdAt: '2024-05-08T11:05:00Z',
  },
];

export const INITIAL_MOCKUP_CONFIG: MockupConfig = {
  id: 'mockup-default',
  assetType: 'device_frame',
  frameType: 'macbook',
  sourceImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  aspectRatio: '16:9',
  gradientBg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
  shadowIntensity: 40,
  glareEffect: true,
};

export const INITIAL_PORTFOLIO_CONFIG: PortfolioConfig = {
  id: 'port-1',
  themeId: 'dark-glass',
  subdomain: 'alex-systems',
  customDomain: 'alex.systems',
  domainVerified: true,
  projectIds: ['node-1', 'node-2', 'node-3'],
  published: true,
};

export const INITIAL_JOB_DESCRIPTION: JobDescription = {
  id: 'jd-1',
  userId: 'user-1',
  rawText: `We are looking for a Principal / Staff Infrastructure Engineer to scale our distributed core services. 
Requirements: 6+ years with Go, Kubernetes, PostgreSQL/pgvector, distributed storage, and high-throughput low-latency networking. Experience reducing cloud infrastructure egress costs is a major plus.`,
  company: 'Linear Corp',
  roleTitle: 'Staff Infrastructure & Platform Engineer',
  parsedRequirements: {
    requiredSkills: ['Go', 'Kubernetes', 'Distributed Systems', 'PostgreSQL', 'pgvector', 'FinOps / Cost Optimization'],
    senioritySignals: ['Staff / Principal', '6+ Years Experience', 'Architecture Ownership'],
    keywords: ['High Throughput', 'p99 Latency', 'Multi-AZ Egress', 'HNSW Indexing'],
    atsQuirks: ['Strict Single Column Standard', 'No Nested Tables', 'Action-Result Quantified Format'],
  },
  createdAt: '2024-05-01T08:00:00Z',
};

export const INITIAL_GENERATED_RESUME: GeneratedResume = {
  id: 'res-1',
  userId: 'user-1',
  jobDescriptionId: 'jd-1',
  templateId: 'modern-ats',
  atsScore: 94.5,
  scoreBreakdown: {
    keywordMatch: 96,
    formatCompliance: 100,
    actionVerbStrength: 92,
    brevityDensity: 90,
  },
  characterCount: 2840,
  maxCharacterBudget: 3200,
  bullets: [
    {
      resumeId: 'res-1',
      careerNodeId: 'node-1',
      rankScore: 0.98,
      finalText: 'Architected multi-AZ Go proxy mesh handling 400k rps, reducing p99 tail latency by 42% and eliminating $1.2M in annual egress cloud costs.',
      included: true,
    },
    {
      resumeId: 'res-1',
      careerNodeId: 'node-2',
      rankScore: 0.95,
      finalText: 'Engineered pgvector HNSW indexing pipeline in Postgres, delivering sub-5ms cosine similarity search across 10M embeddings with an 85% memory reduction.',
      included: true,
    },
    {
      resumeId: 'res-1',
      careerNodeId: 'node-3',
      rankScore: 0.88,
      finalText: 'Keynote Speaker at GopherCon 2024 on memory optimization and zero-copy streams in Go for 1,500+ engineers; open-source companion repo gained 2,400+ stars.',
      included: true,
    },
  ],
  createdAt: '2024-05-02T10:00:00Z',
};
