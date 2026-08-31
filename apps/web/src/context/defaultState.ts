import { JobDescription, GeneratedResume, MockupConfig, PortfolioConfig } from '../lib/types';

export const defaultJobDescription: JobDescription = {
  id: 'jd-active',
  userId: 'usr-1',
  rawText: 'Staff Distributed Systems Engineer: Go, PostgreSQL, pgvector, High Throughput.',
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
  atsScore: 94,
  scoreBreakdown: { keywordMatch: 95, formatCompliance: 100, actionVerbStrength: 92, brevityDensity: 89 },
  characterCount: 1840,
  maxCharacterBudget: 2400,
  bullets: [],
  createdAt: new Date().toISOString(),
};

export const defaultMockup: MockupConfig = {
  id: 'mockup-default',
  assetType: 'device_frame',
  frameType: 'macbook',
  sourceImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  aspectRatio: '16:9',
  gradientBg: 'from-blue-600 via-indigo-700 to-purple-800',
  shadowIntensity: 40,
  glareEffect: true,
};

export const defaultPortfolio: PortfolioConfig = {
  id: 'port-live',
  themeId: 'dark-glass',
  subdomain: 'alex-chen',
  domainVerified: true,
  projectIds: [],
  published: true,
};
