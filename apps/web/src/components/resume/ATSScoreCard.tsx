'use client';

import React from 'react';
import { ShieldCheck, Target, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CountUp } from '@karma/ui';

export const ATSScoreCard: React.FC = () => {
  const { resume, jobDescription } = useApp();
  const { scoreBreakdown, atsScore } = resume;
  const hasJob = !!jobDescription.company || !!jobDescription.roleTitle;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              ATS Match &amp; Relevance Score
            </h3>
            <p className="text-[10px] text-neutral-400">
              {hasJob
                ? `Calculated against ${jobDescription.company} (${jobDescription.roleTitle})`
                : 'Set a target job to score resume compatibility'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-emerald-400 leading-none">
            {atsScore > 0 ? (
              <CountUp to={atsScore} decimals={1} suffix="%" duration={1.5} />
            ) : (
              '--%'
            )}
          </div>
          <span className="text-[10px] font-medium text-neutral-400 uppercase">
            {atsScore > 80 ? 'Strong Match' : atsScore > 0 ? 'Partial Match' : 'Target Pending'}
          </span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Keywords</span>
            <Target className="w-3 h-3 text-indigo-400" />
          </div>
          <p className="text-sm font-bold font-mono text-white">
            {scoreBreakdown.keywordMatch > 0 ? `${scoreBreakdown.keywordMatch}%` : '--'}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Formatting</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          </div>
          <p className="text-sm font-bold font-mono text-white">
            {scoreBreakdown.formatCompliance > 0 ? `${scoreBreakdown.formatCompliance}%` : '100%'}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Action Verbs</span>
            <Zap className="w-3 h-3 text-amber-400" />
          </div>
          <p className="text-sm font-bold font-mono text-white">
            {scoreBreakdown.actionVerbStrength > 0 ? `${scoreBreakdown.actionVerbStrength}%` : '--'}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Conciseness</span>
            <ShieldCheck className="w-3 h-3 text-purple-400" />
          </div>
          <p className="text-sm font-bold font-mono text-white">
            {scoreBreakdown.brevityDensity > 0 ? `${scoreBreakdown.brevityDensity}%` : '--'}
          </p>
        </div>
      </div>
    </div>
  );
};
