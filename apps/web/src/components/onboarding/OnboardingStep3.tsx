'use client';

import React from 'react';
import { CheckCircle2, ArrowRight, Sparkles, FileText, Image, Globe, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OnboardingStep3Props {
  roleTitle: string;
  targetCompany: string;
  achievement: string;
}

export const OnboardingStep3: React.FC<OnboardingStep3Props> = ({
  roleTitle,
  targetCompany,
  achievement,
}) => {
  const router = useRouter();

  const handleFinish = () => {
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
          Step 3 of 3 &middot; Compounding Engine Live
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight pt-2">
          Your Career Engine is Configured!
        </h2>
        <p className="text-xs text-neutral-400">
          Karma auto-structured your achievement across all 4 production layers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
        {/* Layer 1: STAR Graph */}
        <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Career Graph Node</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-neutral-300 line-clamp-2">
            &quot;{achievement}&quot; &rarr; 1536-dim vector indexed in pgvector.
          </p>
        </div>

        {/* Layer 2: 1-Page ATS */}
        <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>1-Page ATS Match</span>
            </div>
            <span className="text-xs font-bold text-emerald-400">92%</span>
          </div>
          <p className="text-[11px] text-neutral-300">
            Selected in knapsack character budget for {roleTitle} at {targetCompany || 'Top Tech'}.
          </p>
        </div>

        {/* Layer 3: Visual Proof */}
        <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Image className="w-4 h-4 text-amber-400" />
              <span>Visual Proof Mockup</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-neutral-300">
            Rendered high-DPI device frame and benchmark card attached to milestone.
          </p>
        </div>

        {/* Layer 4: Public Subdomain */}
        <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Portfolio Routing</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400">Ready</span>
          </div>
          <p className="text-[11px] text-neutral-300">
            Live preview routed and ready to publish at your custom subdomain.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto pt-2">
        <button
          onClick={handleFinish}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Your Logged-In Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
