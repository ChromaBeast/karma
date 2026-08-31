'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, GitGraph } from 'lucide-react';
import { OverviewMetrics } from '../components/dashboard/OverviewMetrics';
import { QuickActionsBar } from '../components/dashboard/QuickActionsBar';
import { CareerNodeCard } from '../components/career/CareerNodeCard';
import { useApp } from '../context/AppContext';
import { ShinyText, DecryptedText, Particles } from '@karma/ui';

export default function DashboardPage() {
  const { nodes } = useApp();

  return (
    <div className="relative min-h-screen p-6 max-w-7xl mx-auto space-y-8">
      {/* Background Interactive Particles */}
      <Particles particleCount={35} maxDistance={100} className="opacity-30 pointer-events-none" />

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-indigo-950/40 p-8 overflow-hidden shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs text-indigo-300 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <DecryptedText text="Career Compounding Operating System" speed={20} />
        </div>

        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            What you ship becomes <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              <ShinyText text="what you're known for." speed={3} />
            </span>
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Karma turns daily commits, architectures, and work achievements into live 1-page ATS resumes, proof mockups, and personal portfolio showcases.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/career"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
          >
            <GitGraph className="w-4 h-4" />
            <span>Explore Career Graph</span>
          </Link>
          <Link
            href="/resume"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-all"
          >
            <span>Generate ATS Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <OverviewMetrics />

      {/* Quick Action Modules */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
          Product Modules & Automation
        </h3>
        <QuickActionsBar />
      </div>

      {/* Recent Career Nodes Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Career Graph Artifacts</h3>
            <p className="text-xs text-neutral-500">Live STAR & XYZ structured evidence nodes</p>
          </div>
          <Link
            href="/career"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
          >
            <span>View All ({nodes.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.slice(0, 2).map((node) => (
            <CareerNodeCard key={node.id} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
