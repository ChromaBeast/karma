'use client';

import React from 'react';
import { FileText, Clock, ShieldCheck, Zap } from 'lucide-react';
import { CountUp } from '@karma/ui';

const METRICS = [
  {
    icon: FileText,
    value: 1,
    suffix: ' Page',
    decimals: 0,
    label: 'Hard Page Constraint',
    detail: 'Never overflows to an awkward page 2',
    color: 'text-indigo-400',
  },
  {
    icon: Clock,
    value: 10,
    suffix: 's',
    decimals: 0,
    label: 'Quick-Add Logging',
    detail: 'Save a win right as you merge your PR',
    color: 'text-purple-400',
  },
  {
    icon: ShieldCheck,
    value: 100,
    suffix: '%',
    decimals: 0,
    label: 'Private & Encrypted',
    detail: 'Your API keys stay encrypted in PostgreSQL',
    color: 'text-emerald-400',
  },
  {
    icon: Zap,
    value: 2,
    suffix: 'ms',
    decimals: 0,
    label: 'Search & Match Speed',
    detail: 'Fast pgvector matching against job descriptions',
    color: 'text-amber-400',
  },
];

export const SocialProofBar: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {METRICS.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className="p-4 sm:p-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-md flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{m.label}</span>
              <Icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-0.5">
                <CountUp to={m.value} duration={2} decimals={m.decimals} />
                <span className={m.color}>{m.suffix}</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 font-normal">{m.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
