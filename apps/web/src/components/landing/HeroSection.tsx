'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, GitGraph, FileText, Shield, Zap, Sparkles, Terminal } from 'lucide-react';
import { ShinyText, Particles } from '@karma/ui';
import { useAuth } from '../../context/AuthContext';
import { HeroTerminal } from './HeroTerminal';

export const HeroSection: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <div className="relative rounded-3xl border border-neutral-800/90 bg-gradient-to-b from-[#0A0B10] via-neutral-900/90 to-[#0F111A] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl space-y-8">
      {/* Background Ambient Particles */}
      <Particles particleCount={35} maxDistance={120} className="opacity-30 pointer-events-none" />

      {/* Grid Layout: Left Thesis + Right Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Thesis & Value Prop */}
        <div className="lg:col-span-7 space-y-5">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-[11px] font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>THE CONTINUOUS CAREER COMPILER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.12]">
            Turn daily engineering wins into <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400">
              <ShinyText text="1-page ATS resumes &amp; proof." speed={3} />
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
            Stop scrambling to reconstruct what you shipped 6 months ago. Karma continuously parses your PRs and architectural milestones into structured STAR metrics, strictly fitted 1-page resumes, and verified proof mockups.
          </p>

          {/* CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/career"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                >
                  <GitGraph className="w-4 h-4" />
                  <span>Open Career Graph</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/resume"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-all"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Compile Resume</span>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start Tracking Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/onboarding"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-700/80 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Launch Setup Wizard</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Terminal Signature */}
        <div className="lg:col-span-5">
          <HeroTerminal />
        </div>
      </div>

      {/* Feature Badges Footer */}
      <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-neutral-400">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted BYOK Key Vault</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span>Strict 1-Page Knapsack Density</span>
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Automated STAR Structuring</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Zero Monthly Subscriptions</span>
        </div>
      </div>
    </div>
  );
};
