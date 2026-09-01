'use client';

import React, { useState } from 'react';
import { Terminal, Sparkles } from 'lucide-react';

const SAMPLES = [
  {
    input: 'Rewrote Postgres queries with composite indexes and Redis TTL cache, handling 120k req/s at 1.8ms p99 latency.',
    role: 'Senior Distributed Systems Engineer',
    chars: 1840,
    maxChars: 2400,
    atsMatch: '96.4%',
    stack: ['Go', 'PostgreSQL', 'Redis', 'High Concurrency'],
  },
  {
    input: 'Architected AES-256 envelope encryption BYOK vault with 0 plain-text key persistence on disk.',
    role: 'Security & Infrastructure Architect',
    chars: 2120,
    maxChars: 2400,
    atsMatch: '94.8%',
    stack: ['KMS', 'Cryptography', 'Go Chi', 'Zero-Trust'],
  },
];

export const HeroTerminal: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = SAMPLES[selectedIdx];
  const charPct = Math.round((current.chars / current.maxChars) * 100);

  return (
    <div className="relative rounded-2xl border border-neutral-800/90 bg-[#0B0C10] p-4 sm:p-5 shadow-2xl space-y-3.5 text-xs">
      {/* Terminal Window Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-[11px] text-neutral-400 pl-1 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>karma-compiler &middot; v1.0</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>AST Knapsack Engine Live</span>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono uppercase text-neutral-400">Sample:</span>
        {SAMPLES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-all ${
              selectedIdx === idx
                ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300'
                : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white'
            }`}
          >
            Win #{idx + 1}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 font-mono text-[11px] space-y-1">
        <div className="text-neutral-400 text-[10px]">$ karma ingest --auto-star</div>
        <div className="text-neutral-200 leading-relaxed">&gt; &quot;{current.input}&quot;</div>
      </div>

      {/* Compiler Output & 1-Page ATS Budget */}
      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
        {/* ATS Pass Metric */}
        <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="text-[10px] text-neutral-400 flex items-center justify-between">
            <span>ATS Match Score</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-base font-bold text-emerald-400">{current.atsMatch}</div>
          <div className="text-[9px] text-neutral-400 truncate">{current.role}</div>
        </div>

        {/* 1-Page Knapsack Character Budget */}
        <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
          <div className="text-[10px] text-neutral-400 flex items-center justify-between">
            <span>1-Page Budget</span>
            <span className="text-cyan-400 font-bold">{charPct}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" style={{ width: `${charPct}%` }} />
          </div>
          <div className="text-[9px] text-neutral-400">
            {current.chars.toLocaleString()} / {current.maxChars.toLocaleString()} chars
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 pt-1">
        {current.stack.map((t) => (
          <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};
