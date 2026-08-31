import { JobDescription, GeneratedResume, MockupConfig, PortfolioConfig, CareerNode, VaultKey } from '../lib/types';

export const defaultNodes: CareerNode[] = [];

export const defaultVaultKeys: VaultKey[] = [];

export const defaultJobDescription: JobDescription = {
  id: '',
  userId: '',
  rawText: '',
  company: '',
  roleTitle: '',
  parsedRequirements: {
    requiredSkills: [],
    senioritySignals: [],
    keywords: [],
    atsQuirks: [],
  },
  createdAt: new Date().toISOString(),
};

export const defaultResume: GeneratedResume = {
  id: '',
  userId: '',
  templateId: 'modern-ats',
  atsScore: 0,
  scoreBreakdown: { keywordMatch: 0, formatCompliance: 100, actionVerbStrength: 0, brevityDensity: 0 },
  characterCount: 0,
  maxCharacterBudget: 2400,
  bullets: [],
  createdAt: new Date().toISOString(),
};

export const defaultMockup: MockupConfig = {
  id: '',
  assetType: 'device_frame',
  frameType: 'macbook',
  sourceImageUrl: '',
  aspectRatio: '16:9',
  gradientBg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
  shadowIntensity: 40,
  glareEffect: true,
};

export const defaultPortfolio: PortfolioConfig = {
  id: '',
  themeId: 'dark-glass',
  subdomain: '',
  domainVerified: false,
  projectIds: [],
  published: false,
};
