'use client';

import React from 'react';
import { ShieldCheck, Target, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CountUp } from '@karma/ui';

export const ATSScoreCard: React.FC = () => {
  const { resume } = useApp();
  const { scoreBreakdown, atsScore } = resume;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              ATS Match & Scoring
            </h3>
            <p className="text-[10px] text-neutral-400">
              Deterministic parsing check against JD constraints
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-emerald-400 leading-none">
            <CountUp to={atsScore} decimals={1} suffix="%" duration={1.5} />
          </div>
          <span className="text-[10px] font-medium text-emerald-500 uppercase">
            High ATS Probability
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
            {scoreBreakdown.keywordMatch}%
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Format</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          </div>
          <p className="text-sm font-bold font-mono text-white">
            {scoreBreakdown.formatCompliance}%
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Action Verbs</span>
            <Zap className="w-3 h-3 text-amber-400" />
          </div>
          <p className="text-sm font-bold font-mono text-white">
            {scoreBreakdown.actionVerbStrength}%
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Brevity</span>
            <ShieldCheck className="w-3 h-3 text-purple-400" />
          </div>
          <p className="text-sm font-bold font-mono text-white">
            {scoreBreakdown.brevityDensity}%
          </p>
        </div>
      </div>
    </div>
  );
};
