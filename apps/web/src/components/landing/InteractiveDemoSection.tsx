'use client';

import React, { useState } from 'react';
import { GitGraph, FileText, Code2, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { SpotlightCard } from '@karma/ui';

const DEMO_TABS = [
  { id: 'graph', label: '1. STAR Ingestion', icon: GitGraph },
  { id: 'resume', label: '2. Knapsack Budget', icon: FileText },
  { id: 'mockup', label: '3. Ray.so Code Frame', icon: Code2 },
  { id: 'vault', label: '4. AES-256 Vault', icon: ShieldCheck },
];

export const InteractiveDemoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('graph');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/40">
          The 4 Production Engines
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
          Engineered for engineering proof
        </h2>
        <p className="text-xs text-neutral-400">
          Explore the exact pipelines that transform raw terminal achievements into tailored assets.
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
      <SpotlightCard className="p-6 sm:p-8 rounded-3xl border border-neutral-800 bg-[#0C0D12] backdrop-blur-xl shadow-2xl">
        {activeTab === 'graph' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Engine 01 &middot; STAR AST Parser</span>
              <h3 className="text-xl font-bold text-white">Unstructured PRs in. Quantified metrics out.</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Whenever you merge a high-impact feature, paste a 1-sentence note. Karma extracts the action verb, quantifiable metrics, and tech stack tags with 1536-dim pgvector indexing.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Automatic latency, dollar saved, and throughput extraction</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Persistent vector embedding for cosine similarity matching</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 font-mono text-xs space-y-2.5">
              <div className="text-neutral-500 text-[10px] border-b border-neutral-800 pb-1.5 flex justify-between">
                <span>INPUT_STREAM</span>
                <span className="text-cyan-400">POST /v1/career-events</span>
              </div>
              <div className="text-neutral-300 text-[11px]">&gt; &quot;Cut our backend query latency from 450ms to 45ms with an in-memory cache cluster in Go&quot;</div>
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-[11px] space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Parsed STAR Node:</span>
                </div>
                <div>&bull; Action: Architected in-memory caching layer with TTL eviction</div>
                <div>&bull; Metric: 90% latency reduction (450ms &rarr; 45ms)</div>
                <div>&bull; Vector: [0.0412, -0.0891, ... 1536 dims]</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">Engine 02 &middot; Knapsack Budget Solver</span>
              <h3 className="text-xl font-bold text-white">Mathematical 1-page fit. Zero margin hacks.</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Paste any target job description. Karma ranks your career nodes by cosine similarity and uses a dynamic programming knapsack fit to ensure your resume fits on exactly one page.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Matches relevant keywords to the job description</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Hard character limit guarantees a clean 1-page PDF</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Character Budget Usage</span>
                <span className="text-emerald-400 font-bold">1,840 / 2,400 chars (77%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div className="w-[77%] h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full" />
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Target: Staff Distributed Systems Architect</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">96% Match</span>
                </div>
                <p className="text-neutral-400 text-[10px]">6 top-ranked bullets selected based on high concurrency &amp; Go.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mockup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">Engine 03 &middot; Visual Proof Studio</span>
              <h3 className="text-xl font-bold text-white">Show, don&apos;t just tell, what you shipped.</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Render code snippets, benchmark badges, or UI screenshots in high-resolution MacBook Pro, dark browser, or mobile device frames for your portfolio and LinkedIn.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Ray.so style syntax highlighted code frames</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Direct ImageKit CDN upload + 4K PNG export</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] text-neutral-500">cache_layer.go</span>
              </div>
              <pre className="text-indigo-300 text-[11px] leading-relaxed overflow-x-auto">
                {`func (c *Cache) GetOrSet(key string) (*Node, error) {
    if v, ok := c.lru.Get(key); ok {
        return v, nil // < 2ms hit
    }
    return c.fetchFromDB(key)
}`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Engine 04 &middot; AES-256 Vault</span>
              <h3 className="text-xl font-bold text-white">Encrypted BYOK security. Wholesale AI pricing.</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Connect your OpenAI or Anthropic API key with envelope encryption. We encrypt with AES-256-GCM in PostgreSQL and only decrypt in memory during live generation.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Zero plain text keys persisted on disk</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Pay wholesale rates (~$0.01 per resume)</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-emerald-950/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 border-b border-neutral-800 pb-2">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> AES-256-GCM ENVELOPE</span>
                <span>Active</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1 text-[11px]">
                <div className="text-neutral-400">Key: sk-ant-api03-&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;-98a4</div>
                <div className="text-emerald-400 text-[10px]">Decrypted strictly in-memory per request</div>
              </div>
            </div>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
