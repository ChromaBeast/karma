'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, GitGraph, FileText, Shield, Zap } from 'lucide-react';
import { ShinyText, DecryptedText, Particles } from '@karma/ui';
import { useAuth } from '../../context/AuthContext';

export const HeroSection: React.FC = () => {
  const { isAuthenticated, openAuthModal, demoLogin } = useAuth();

  return (
    <div className="relative rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-indigo-950/30 p-8 sm:p-12 overflow-hidden shadow-2xl space-y-6">
      {/* Background Ambient Particles */}
      <Particles particleCount={40} maxDistance={110} className="opacity-40 pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-xs text-indigo-300 font-mono shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <DecryptedText text="The Career Compounding Operating System" speed={25} />
      </div>

      {/* Hero Title & Value Proposition */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          What you ship becomes <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            <ShinyText text="what you're known for." speed={3} />
          </span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
          Karma captures daily commits, architectures, and work events into an immutable graph—turning your raw output into live 1-page ATS resumes, proof mockups, and personal portfolio showcases.
        </p>
      </div>

      {/* CTA Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {isAuthenticated ? (
          <>
            <Link
              href="/career"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <GitGraph className="w-4 h-4" />
              <span>Open Career Graph</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/resume"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs sm:text-sm font-semibold border border-neutral-700 transition-all"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>ATS Resume Builder</span>
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={openAuthModal}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={demoLogin}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-semibold border border-neutral-700 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1-Click Live Demo</span>
            </button>
          </>
        )}
      </div>

      {/* Feature Badges Footer */}
      <div className="pt-4 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>BYOK Envelope Vault</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GitGraph className="w-3.5 h-3.5 text-indigo-400" />
          <span>pgvector Similarity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span>Knapsack 1-Page ATS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Zero Lock-in UI</span>
        </div>
      </div>
    </div>
  );
};
