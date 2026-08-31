'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface OnboardingStep1Props {
  roleTitle: string;
  setRoleTitle: (r: string) => void;
  targetCompany: string;
  setTargetCompany: (c: string) => void;
  seniority: string;
  setSeniority: (s: string) => void;
  onNext: () => void;
}

const ROLES = [
  'Senior Backend Engineer',
  'Staff Distributed Systems Architect',
  'Lead Fullstack Engineer',
  'Infrastructure / Platform Engineer',
  'AI / ML Systems Engineer',
];

const COMPANIES = ['Stripe', 'OpenAI', 'Datadog', 'Vercel', 'Coinbase', 'Scale AI'];

export const OnboardingStep1: React.FC<OnboardingStep1Props> = ({
  roleTitle,
  setRoleTitle,
  targetCompany,
  setTargetCompany,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/40">
          Step 1 of 3 &middot; Target Trajectory
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight pt-2">
          What role are you targeting next?
        </h2>
        <p className="text-xs text-neutral-400">
          Karma tailors your career graph, ATS character budgets, and proof mockups to this target.
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {/* Role Title */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Target Job Title
          </label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5 pt-2">
            {ROLES.slice(0, 3).map((r) => (
              <button
                key={r}
                onClick={() => setRoleTitle(r)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800"
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Target Company */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Target Company / Industry
          </label>
          <input
            type="text"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="e.g. Stripe, OpenAI"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5 pt-2">
            {COMPANIES.map((c) => (
              <button
                key={c}
                onClick={() => setTargetCompany(c)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!roleTitle.trim()}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
        >
          <span>Continue to Ingest First Win</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
