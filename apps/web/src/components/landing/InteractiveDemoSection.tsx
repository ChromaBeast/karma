'use client';

import React, { useState } from 'react';
import { GitGraph, FileText, Smartphone, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { SpotlightCard } from '@karma/ui';

const DEMO_TABS = [
  { id: 'graph', label: '1. Event Ingestion', icon: GitGraph },
  { id: 'resume', label: '2. Knapsack ATS Engine', icon: FileText },
  { id: 'mockup', label: '3. Proof Mockup Studio', icon: Smartphone },
  { id: 'vault', label: '4. Zero-Knowledge Vault', icon: ShieldCheck },
];

export const InteractiveDemoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('graph');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/50 text-[11px] text-indigo-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Architectural Demo</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          How Karma Compounds Your Career
        </h2>
        <p className="text-xs text-neutral-400">
          Click the workflow stages below to see how raw commits turn into verified career equity.
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
              <span className="text-xs font-mono text-indigo-400">STAGE 01: RAW EVENT INGESTION</span>
              <h3 className="text-xl font-bold text-white">From Slack message or commit to structured vector node</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Send a quick thought or raw changelog. Background workers automatically decompose the text into STAR/XYZ metrics and generate 1536-dimensional embeddings for pgvector retrieval.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Automatic metric extraction ($ Saved, % Latency, Scale)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> pgvector cosine similarity index</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-500 border-b border-neutral-800 pb-2">
                <span>POST /v1/career-events</span>
                <span className="text-emerald-400">200 OK (18ms)</span>
              </div>
              <div className="text-neutral-400">&gt; &quot;Cut API latency from 450ms to 45ms with redis cache cluster&quot;</div>
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-indigo-200 text-[11px] space-y-1">
                <div className="font-bold text-white">✨ Structured Node: #node-842</div>
                <div>Action: Architected distributed Redis caching cluster</div>
                <div>Metric: 90% Latency Reduction (450ms &rarr; 45ms)</div>
                <div className="text-indigo-400 text-[10px]">Embedding: [0.0381, -0.1942, 0.8841, ...] (pgvector)</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-purple-400">STAGE 02: KNAPSACK ATS OPTIMIZER</span>
              <h3 className="text-xl font-bold text-white">Single-page density without overflow risk</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Karma models resume building as a constrained Knapsack optimization problem. It selects the highest-scoring achievements for a given job description that strictly fit into a 1-page character budget.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Semantic keyword density scoring</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Strict 2,800-character budget constraint</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Character Budget Gauge</span>
                <span className="text-emerald-400 font-mono font-bold">2,420 / 2,800 chars (86%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div className="w-[86%] h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">ATS Keyword Match</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">98.4% Match</span>
                </div>
                <p className="text-neutral-400 text-[11px]">Rank 1: Distributed Systems, Go, pgvector, Envelope Encryption</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mockup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-sky-400">STAGE 03: PROOF MOCKUP STUDIO</span>
              <h3 className="text-xl font-bold text-white">Turn code into viral proof of work</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Generate 3D device frames, angled perspective cards, and high-DPI social media assets from project screenshots and system architectures in 1 click.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Photorealistic MacBook & iPhone frames</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Export 4K PNG with customized glow</div>
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
                  &lt;Live System Architecture /&gt;
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-emerald-400">STAGE 04: ZERO-KNOWLEDGE BYOK VAULT</span>
              <h3 className="text-xl font-bold text-white">Hardware-backed envelope encryption</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Bring your own Anthropic, OpenAI, or Gemini keys. Keys are encrypted with user-specific AES-256-GCM data keys wrapped with KMS. Outbound calls are locked at the network layer.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 0 plain text API keys stored</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Outbound LLM base-URL allow-list</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-emerald-950/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 border-b border-neutral-800 pb-2">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> AES-256-GCM ENCRYPTED</span>
                <span>KMS WRAPPED</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1 text-[11px]">
                <div className="text-neutral-400">Key: sk-ant-api03-••••••••••••-98a4</div>
                <div className="text-emerald-400 text-[10px]">Ciphertext: 8f9a2b7c4d1e8a9... (Decrypted in-memory only during request)</div>
              </div>
            </div>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
