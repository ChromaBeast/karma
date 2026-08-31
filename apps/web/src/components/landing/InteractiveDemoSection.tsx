'use client';

import React, { useState } from 'react';
import { GitGraph, FileText, Smartphone, ShieldCheck, Check } from 'lucide-react';
import { SpotlightCard } from '@karma/ui';

const DEMO_TABS = [
  { id: 'graph', label: '1. Log a Shipped Win', icon: GitGraph },
  { id: 'resume', label: '2. 1-Page Resume Matcher', icon: FileText },
  { id: 'mockup', label: '3. Device Mockups', icon: Smartphone },
  { id: 'vault', label: '4. Encrypted Key Vault', icon: ShieldCheck },
];

export const InteractiveDemoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('graph');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          How it works in practice
        </h2>
        <p className="text-xs text-neutral-400">
          From a quick Slack note or commit message to a polished resume and portfolio.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 max-w-2xl mx-auto">
        {DEMO_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Display Area */}
      <SpotlightCard className="p-6 sm:p-8 rounded-3xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-xl shadow-2xl">
        {activeTab === 'graph' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">Step 1 · Quick Ingestion</span>
              <h3 className="text-xl font-bold text-white">Paste a messy PR or message. Get a structured accomplishment.</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Whenever you finish a big project, drop a 1-sentence note. Karma extracts the action verb, quantifiable metrics, and tech stack tags so you have the details ready for reviews.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Pulls out metrics like latency dropped, dollars saved, or scale handled</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Stores your history securely in PostgreSQL</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 font-mono text-xs space-y-3">
              <div className="text-neutral-500 text-[11px] border-b border-neutral-800 pb-2">
                Input: Raw work note
              </div>
              <div className="text-neutral-300">&gt; &quot;Cut our backend query latency from 450ms to 45ms with an in-memory cache cluster in Go&quot;</div>
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-indigo-200 text-[11px] space-y-1">
                <div className="font-bold text-white">✨ Structured Entry:</div>
                <div>• Action: Architected in-memory caching layer with TTL eviction</div>
                <div>• Metric: 90% latency reduction (450ms &rarr; 45ms)</div>
                <div>• Tags: Go, Concurrency, Redis, Distributed Systems</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">Step 2 · 1-Page Resume Matcher</span>
              <h3 className="text-xl font-bold text-white">Pick the right accomplishments. Never spill over to page 2.</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Paste any job description. Karma scans your brag document, selects the highest-scoring bullet points for that specific role, and calculates the exact character budget to fit on exactly one page.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Matches relevant keywords to the job description</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Hard character limit guarantees a clean 1-page PDF</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">1-Page Character Budget</span>
                <span className="text-emerald-400 font-mono font-bold">2,420 / 2,800 characters</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div className="w-[86%] h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Target: Senior Backend Engineer</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">High Match</span>
                </div>
                <p className="text-neutral-400 text-[11px]">Selected 6 top bullet points highlighting Go, PostgreSQL, and high-throughput systems.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mockup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">Step 3 · Device Mockup Studio</span>
              <h3 className="text-xl font-bold text-white">Show, don&apos;t just tell, what you built.</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Take a raw screenshot of your tool, dashboard, or UI and wrap it in a clean MacBook, dark browser, or mobile device frame for your portfolio.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Instant high-res export</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Clean dark backgrounds without opening Figma</div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-neutral-950 to-purple-950/40 border border-neutral-800 flex items-center justify-center">
              <div className="w-full max-w-[280px] p-4 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl shadow-indigo-500/20 transform hover:-rotate-1 hover:scale-105 transition-all">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-24 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-xs text-indigo-300 font-mono">
                  [ System Architecture &amp; Metrics ]
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Step 4 · Encrypted Key Vault</span>
              <h3 className="text-xl font-bold text-white">Bring your own AI keys. We don&apos;t store plain text.</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Connect your OpenAI or Anthropic API key. We encrypt your key in the database with AES-256 and only decrypt it in-memory when you make a generation request.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Zero plain text keys stored on disk</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> You pay API cost directly at wholesale rates ($0.01 per resume)</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-emerald-950/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 border-b border-neutral-800 pb-2">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> AES-256-GCM ENCRYPTED</span>
                <span>Protected</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1 text-[11px]">
                <div className="text-neutral-400">Key: sk-ant-api03-••••••••••••-98a4</div>
                <div className="text-emerald-400 text-[10px]">Encrypted with unique user data key in PostgreSQL</div>
              </div>
            </div>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
