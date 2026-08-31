'use client';

import React, { useState } from 'react';
import { FileEdit } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ATSScoreCard } from '../../components/resume/ATSScoreCard';
import { KnapsackBar } from '../../components/resume/KnapsackBar';
import { BulletSelector } from '../../components/resume/BulletSelector';
import { ResumePreviewA4 } from '../../components/resume/ResumePreviewA4';
import { JDInputModal } from '../../components/resume/JDInputModal';
import { DecryptedText } from '@karma/ui';

export default function ResumePage() {
  const { jobDescription } = useApp();
  const [showJDModal, setShowJDModal] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              1-Page Tailored Resume Builder
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <DecryptedText text="1-Page Layout Optimizer" speed={25} />
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Selects your top matching accomplishments and fits them cleanly onto one page.
          </p>
        </div>

        <button
          onClick={() => setShowJDModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
        >
          <FileEdit className="w-4 h-4" />
          <span>Target Job: {jobDescription.company}</span>
        </button>
      </div>

      {/* Target JD Summary Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white">{jobDescription.roleTitle}</span>
          <span className="text-neutral-500">•</span>
          <span className="text-indigo-400 font-medium">{jobDescription.company}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {jobDescription.parsedRequirements.requiredSkills.slice(0, 3).map((sk) => (
            <span
              key={sk}
              className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-mono hidden md:inline-block"
            >
              {sk}
            </span>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: Controls + Live A4 Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: ATS Score, Knapsack Bar, Bullet Selector */}
        <div className="lg:col-span-5 space-y-4">
          <ATSScoreCard />
          <KnapsackBar />
          <BulletSelector />
        </div>

        {/* Right Column: Live A4 Document Preview */}
        <div className="lg:col-span-7">
          <ResumePreviewA4 />
        </div>
      </div>

      {showJDModal && <JDInputModal onClose={() => setShowJDModal(false)} />}
    </div>
  );
}
