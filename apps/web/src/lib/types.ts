export type CaptureChannel =
  | 'quick_add'
  | 'chat'
  | 'slack_bot'
  | 'voice'
  | 'check_in'
  | 'resume_import';

export type NodeType = 'role' | 'project' | 'achievement' | 'skill' | 'education';

export interface CareerEvent {
  id: string;
  userId: string;
  rawText: string;
  captureChannel: CaptureChannel;
  processedAt?: string;
  careerNodeId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface CareerMetrics {
  dollarSaved?: string;
  percentGrowth?: string;
  timeSaved?: string;
  scale?: string;
  latencyReduction?: string;
  [key: string]: string | undefined;
}

export interface CareerNode {
  id: string;
  userId: string;
  parentId?: string;
  nodeType: NodeType;
  title: string;
  org?: string;
  startDate?: string;
  endDate?: string;
  situationTask?: string;
  action?: string;
  result?: string;
  metrics: CareerMetrics;
  tags: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobDescription {
  id: string;
  userId: string;
  rawText: string;
  company: string;
  roleTitle: string;
  parsedRequirements: {
    requiredSkills: string[];
    senioritySignals: string[];
    keywords: string[];
    atsQuirks: string[];
  };
  createdAt: string;
}

export interface ResumeBulletSelection {
  resumeId: string;
  careerNodeId: string;
  rankScore: number;
  finalText: string;
  included: boolean;
}

export interface GeneratedResume {
  id: string;
  userId: string;
  jobDescriptionId?: string;
  templateId: 'modern-ats' | 'executive' | 'minimalist-tech';
  atsScore: number;
  scoreBreakdown: {
    keywordMatch: number;
    formatCompliance: number;
    actionVerbStrength: number;
    brevityDensity: number;
  };
  characterCount: number;
  maxCharacterBudget: number;
  bullets: ResumeBulletSelection[];
  createdAt: string;
}

export interface MockupConfig {
  id: string;
  assetType: 'device_frame' | 'social_card';
  frameType: 'macbook' | 'iphone' | 'browser' | 'social' | 'tilt_3d';
  sourceImageUrl: string;
  aspectRatio: '16:9' | '4:3' | '1:1' | '9:16';
  gradientBg: string;
  shadowIntensity: number;
  glareEffect: boolean;
}

export interface PortfolioConfig {
  id: string;
  themeId: 'minimal' | 'dark-glass' | 'modern-bento';
  subdomain: string;
  customDomain?: string;
  domainVerified: boolean;
  projectIds: string[];
  published: boolean;
}

export type LLMProvider = 'anthropic' | 'openai' | 'gemini';

export interface VaultKey {
  id: string;
  provider: LLMProvider;
  keyLast4: string;
  isActive: boolean;
  validatedAt?: string;
  model: string;
}

export interface LLMExecution {
  id: string;
  module: string;
  executionMode: 'byok' | 'managed';
  provider: LLMProvider;
  model: string;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  cacheHit: boolean;
  status: 'success' | 'error' | 'rate_limited';
  latencyMs: number;
  createdAt: string;
}
