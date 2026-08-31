'use client';

import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

const COMPARISONS = [
  {
    feature: 'Tracking Work',
    traditional: 'Digging through old Jira tickets and closed PRs at review time',
    karma: 'Quick log anytime you ship. Metrics and dates saved in one place.',
  },
  {
    feature: 'Customizing for Roles',
    traditional: 'Spending 2 hours manually editing bullet points for each application',
    karma: 'Paste the job description. Karma selects your top matching wins.',
  },
  {
    feature: 'Page Length',
    traditional: 'Fiddling with margins to avoid 2 awkward lines spilling to page 2',
    karma: 'Calculated character budget guarantees a crisp 1-page PDF.',
  },
  {
    feature: 'Pricing & Privacy',
    traditional: '$25–$40/month subscriptions that lock your data on their servers',
    karma: 'One-time access. Bring your own keys with zero markup.',
  },
  {
    feature: 'Visual Proof',
    traditional: 'Plain text bullets without screenshots or live evidence',
    karma: 'Clean device mockups and a hosted portfolio site with custom domain.',
  },
];

export const ComparisonSection: React.FC = () => {
  return (
    <div className="space-y-6 pt-4">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          How Karma compares
        </h2>
        <p className="text-xs text-neutral-400">
          Built for engineers who want a pragmatic, low-overhead way to manage their career.
        </p>
      </div>

      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 p-4 sm:p-5 bg-neutral-950/80 border-b border-neutral-800 text-xs font-bold uppercase tracking-wider">
          <div className="col-span-4 text-neutral-400">Task</div>
          <div className="col-span-4 text-rose-400/90">The Old Way</div>
          <div className="col-span-4 text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>With Karma</span>
          </div>
        </div>

        <div className="divide-y divide-neutral-800/60">
          {COMPARISONS.map((row) => (
            <div key={row.feature} className="grid grid-cols-12 p-4 sm:p-5 text-xs items-center hover:bg-neutral-800/20 transition-colors">
              <div className="col-span-4 font-semibold text-white">{row.feature}</div>
              <div className="col-span-4 text-neutral-400 flex items-start gap-2 pr-2">
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{row.traditional}</span>
              </div>
              <div className="col-span-4 text-indigo-200 flex items-start gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{row.karma}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
