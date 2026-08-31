'use client';

import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

const COMPARISONS = [
  {
    feature: 'Achievement Storage',
    traditional: 'Scattered static PDFs & Word docs',
    karma: 'Immutable Vector Graph in Neon PostgreSQL',
  },
  {
    feature: 'Job Tailoring',
    traditional: 'Manual copy-pasting for hours',
    karma: 'Semantic pgvector Knapsack ranking in 3s',
  },
  {
    feature: 'Page Length Guarantee',
    traditional: 'Random 2nd-page overflow & awkward spacing',
    karma: 'Strict single-page character budget optimizer',
  },
  {
    feature: 'Event Capture',
    traditional: 'Forgotten wins by performance review time',
    karma: 'Instant Slack, Quick-Add & commit ingestion',
  },
  {
    feature: 'AI Pricing & Privacy',
    traditional: '$29/mo SaaS lock-in with server-stored keys',
    karma: 'One-time access + BYOK Zero-Knowledge Vault',
  },
  {
    feature: 'Visual Proof of Work',
    traditional: 'Plain text bullet points without evidence',
    karma: 'Interactive 3D mockups & custom portfolio domain',
  },
];

export const ComparisonSection: React.FC = () => {
  return (
    <div className="space-y-6 pt-4">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Why Traditional Resumes Fail
        </h2>
        <p className="text-xs text-neutral-400">
          Static PDFs lose your accomplishments. A compounding graph preserves and multiplies your career equity.
        </p>
      </div>

      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 p-4 sm:p-5 bg-neutral-950/80 border-b border-neutral-800 text-xs font-bold uppercase tracking-wider">
          <div className="col-span-4 text-neutral-400">Capability</div>
          <div className="col-span-4 text-rose-400/90">Legacy Resume Builders</div>
          <div className="col-span-4 text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Karma OS</span>
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
