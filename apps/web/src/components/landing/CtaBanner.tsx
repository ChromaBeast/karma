'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { ShinyText, Particles } from '@karma/ui';
import { useAuth } from '../../context/AuthContext';

export const CtaBanner: React.FC = () => {
  const { openAuthModal } = useAuth();

  return (
    <div className="relative rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950 via-neutral-900 to-purple-950/60 p-8 sm:p-12 text-center overflow-hidden shadow-2xl space-y-6">
      {/* Ambient Particle Background */}
      <Particles particleCount={30} maxDistance={100} className="opacity-30 pointer-events-none" />

      <div className="space-y-3 max-w-2xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Start keeping track of <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300">
            <ShinyText text="what you build today." speed={3} />
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300">
          Save your first shipped project in 30 seconds. Build tailored 1-page resumes and portfolio pages whenever you need them.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
        <button
          onClick={openAuthModal}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Zap className="w-4 h-4" />
          <span>Get Started Free</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <Link
          href="/onboarding"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-semibold border border-neutral-700 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Quick Setup Wizard</span>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 pt-2 relative z-10">
        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Encrypted BYOK Vault</span>
        <span>&middot;</span>
        <span>No Credit Card Required</span>
        <span>&middot;</span>
        <span>Free Tier Available</span>
      </div>
    </div>
  );
};
