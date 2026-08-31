'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GitGraph,
  FileText,
  KeyRound,
  Globe2,
  Wand2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { EventCaptureModal } from '../../components/career/EventCaptureModal';
import { SpotlightCard, ShinyText } from '@karma/ui';

export default function DashboardPage() {
  const { nodes, resume, vaultKeys, portfolio } = useApp();
  const { user } = useAuth();
  const [showCapture, setShowCapture] = useState(false);

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Engineer');
  const activeKeysCount = vaultKeys.filter((k) => k.isActive).length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Welcome back, {displayName}</span>
          </h1>
          <p className="text-xs text-neutral-400">
            <ShinyText text="Your career compounding workspace & tools hub." speed={4} />
          </p>
        </div>

        <button
          onClick={() => setShowCapture(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Capture Event</span>
        </button>
      </div>

      {/* 4 Primary Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpotlightCard className="p-4 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Career Graph</span>
            <GitGraph className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{nodes.length}</div>
          <p className="text-[11px] text-neutral-500">
            {nodes.length === 1 ? '1 achievement logged' : `${nodes.length} achievements logged`}
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>ATS Resume Match</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {resume.atsScore > 0 ? `${resume.atsScore}%` : '--'}
          </div>
          <p className="text-[11px] text-neutral-500">
            {resume.atsScore > 0 ? 'Optimized for target role' : 'No target job set'}
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>BYOK Vault</span>
            <KeyRound className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{activeKeysCount} / 3</div>
          <p className="text-[11px] text-neutral-500">
            {activeKeysCount > 0 ? 'AES-256 keys active' : 'No keys configured'}
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Portfolio Site</span>
            <Globe2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white truncate">
            {portfolio.published ? 'Live on Edge' : 'Draft'}
          </div>
          <p className="text-[11px] text-neutral-500 truncate">
            {portfolio.subdomain ? `${portfolio.subdomain}.karma.app` : 'Subdomain pending'}
          </p>
        </SpotlightCard>
      </div>

      {/* Quick Launchpad */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
          Quick Launchpad
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/career"
            className="group p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 hover:border-indigo-500/50 transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
                <GitGraph className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-semibold text-white">Career Graph</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Capture pull requests, bug fixes, and milestones structured with STAR metrics.
            </p>
          </Link>

          <Link
            href="/resume"
            className="group p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 hover:border-emerald-500/50 transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-semibold text-white">ATS Resumes</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Knapsack character optimization fitted strictly to single-page PDF compliance.
            </p>
          </Link>

          <Link
            href="/tools"
            className="group p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 hover:border-purple-500/50 transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-400">
                <Wand2 className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-semibold text-white">Career Tools</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Mock interview simulator, targeted cover letters, LinkedIn posts, and skill matrix.
            </p>
          </Link>
        </div>
      </div>

      {showCapture && <EventCaptureModal onClose={() => setShowCapture(false)} />}
    </div>
  );
}
