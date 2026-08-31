'use client';

import React, { useState } from 'react';
import { Share2, Mic, FileText, Target } from 'lucide-react';
import { LinkedInOptimizer } from '../../components/tools/LinkedInOptimizer';
import { InterviewSimulator } from '../../components/tools/InterviewSimulator';
import { CoverLetterGenerator } from '../../components/tools/CoverLetterGenerator';
import { SkillGapMatrix } from '../../components/tools/SkillGapMatrix';
import { DecryptedText } from '@karma/ui';

const TABS = [
  { id: 'linkedin', label: 'LinkedIn Engine', icon: Share2 },
  { id: 'interview', label: 'AI Mock Interview', icon: Mic },
  { id: 'cover-letter', label: 'Cover Letter', icon: FileText },
  { id: 'skill-gap', label: 'Skill Gap Matrix', icon: Target },
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('linkedin');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Career Acceleration Suite
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
              <DecryptedText text="Dual-Execution AI Router" speed={25} />
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Leverage structured achievements across distribution channels, mock interviews, and skill matrices.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="space-y-4">
        {activeTab === 'linkedin' && <LinkedInOptimizer />}
        {activeTab === 'interview' && <InterviewSimulator />}
        {activeTab === 'cover-letter' && <CoverLetterGenerator />}
        {activeTab === 'skill-gap' && <SkillGapMatrix />}
      </div>
    </div>
  );
}
