import { JobDescription, GeneratedResume, MockupConfig, PortfolioConfig, CareerNode, VaultKey } from '../lib/types';

export const defaultNodes: CareerNode[] = [
  {
    id: 'node-1',
    userId: 'usr-1',
    nodeType: 'project',
    title: 'Distributed In-Memory Cache Cluster',
    org: 'Stripe',
    situationTask: 'Database read load reached saturation during flash sales.',
    action: 'Architected thread-safe TTL in-memory cache layer in Go with janitor eviction.',
    result: 'Reduced query latency by 90% (450ms to 45ms) and sustained 100k req/sec.',
    metrics: { latencyReduction: '90%', scale: '100k req/sec', timeSaved: '405ms' },
    tags: ['Go', 'Concurrency', 'Redis', 'Distributed Systems'],
    source: 'github_pr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'node-2',
    userId: 'usr-1',
    nodeType: 'achievement',
    title: 'PostgreSQL Vector Search Indexing',
    org: 'Cloud Infrastructure',
    situationTask: 'Unstructured career notes needed fast similarity search.',
    action: 'Integrated pgvector with 1536-dimensional HNSW cosine embeddings.',
    result: 'Achieved sub-5ms semantic retrieval over 10 million vector records.',
    metrics: { scale: '10M embeddings', latencyReduction: 'sub-5ms' },
    tags: ['PostgreSQL', 'pgvector', 'SIMD', 'AI Search'],
    source: 'quick_add',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'node-3',
    userId: 'usr-1',
    nodeType: 'role',
    title: 'Staff Systems Architect',
    org: 'FinTech Platform',
    action: 'Led a team of 8 backend engineers migrating monolithic services to event-driven Go microservices.',
    result: 'Cut cloud egress infrastructure spend by $1.2M annually.',
    metrics: { dollarSaved: '$1.2M', scale: '8 engineers' },
    tags: ['Architecture', 'Leadership', 'Go', 'Microservices'],
    source: 'check_in',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const defaultVaultKeys: VaultKey[] = [
  {
    id: 'key-1',
    provider: 'anthropic',
    keyLast4: '98a4',
    isActive: true,
    model: 'claude-3-5-sonnet-20241022',
  },
  {
    id: 'key-2',
    provider: 'openai',
    keyLast4: '412e',
    isActive: true,
    model: 'gpt-4o',
  },
  {
    id: 'key-3',
    provider: 'gemini',
    keyLast4: '7b20',
    isActive: false,
    model: 'gemini-1.5-pro',
  },
];

export const defaultJobDescription: JobDescription = {
  id: 'jd-active',
  userId: 'usr-1',
  rawText: 'Staff Distributed Systems Engineer: Go, PostgreSQL, pgvector, High Throughput, Cloud Infrastructure.',
  company: 'Stripe',
  roleTitle: 'Staff Distributed Systems Engineer',
  parsedRequirements: {
    requiredSkills: ['Go', 'PostgreSQL', 'Distributed Systems', 'pgvector'],
    senioritySignals: ['Staff', 'Lead', 'Architecture'],
    keywords: ['Latency', 'Throughput', 'High-Availability', 'Knapsack'],
    atsQuirks: ['Single Column Required', 'No Tables in Layout'],
  },
  createdAt: new Date().toISOString(),
};

export const defaultResume: GeneratedResume = {
  id: 'res-live',
  userId: 'usr-1',
  templateId: 'modern-ats',
  atsScore: 96,
  scoreBreakdown: { keywordMatch: 98, formatCompliance: 100, actionVerbStrength: 94, brevityDensity: 92 },
  characterCount: 2120,
  maxCharacterBudget: 2800,
  bullets: [
    {
      resumeId: 'res-live',
      careerNodeId: 'node-1',
      rankScore: 0.98,
      finalText: 'Architected distributed in-memory cache in Go with TTL eviction, reducing p99 latency by 90% (450ms → 45ms) and scaling throughput to 100k req/sec.',
      included: true,
    },
    {
      resumeId: 'res-live',
      careerNodeId: 'node-2',
      rankScore: 0.95,
      finalText: 'Implemented PostgreSQL pgvector semantic retrieval using 1536-dimensional HNSW embeddings, enabling sub-5ms similarity search over 10M vectors.',
      included: true,
    },
    {
      resumeId: 'res-live',
      careerNodeId: 'node-3',
      rankScore: 0.91,
      finalText: 'Led multi-region proxy mesh re-architecture in Go across 12 availability zones, eliminating $1.2M in annual cloud infrastructure egress costs.',
      included: true,
    },
    {
      resumeId: 'res-live',
      careerNodeId: 'node-4',
      rankScore: 0.86,
      finalText: 'Designed zero-knowledge BYOK encryption vault with user-specific AES-256-GCM data keys and network-layer LLM URL allow-listing.',
      included: true,
    },
  ],
  createdAt: new Date().toISOString(),
};

export const defaultMockup: MockupConfig = {
  id: 'mockup-default',
  assetType: 'device_frame',
  frameType: 'macbook',
  sourceImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  aspectRatio: '16:9',
  gradientBg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
  shadowIntensity: 40,
  glareEffect: true,
};

export const defaultPortfolio: PortfolioConfig = {
  id: 'port-live',
  themeId: 'dark-glass',
  subdomain: 'alex-chen',
  domainVerified: true,
  projectIds: ['node-1', 'node-2'],
  published: true,
};
