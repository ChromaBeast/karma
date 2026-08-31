'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const VARIANTS = [
  {
    type: 'High-Impact Metrics',
    headline: 'Staff Infrastructure Architect | Scaled Go services to 400k rps (-42% tail latency) | pgvector & Distributed Storage',
    post: `🚀 Most microservice bottlenecks aren't CPU-bound—they're network egress & inefficient serialization.

Recently, our team re-architected our multi-region proxy mesh in Go:
• Replaced heavy JSON RPC with zero-copy binary protocols
• Tuned HNSW indexing in PostgreSQL to drop lookup times to <5ms
• Reduced p99 tail latency by 42% while saving $1.2M in annual egress cloud costs.

What’s your team’s biggest bottleneck scaling high-throughput systems?`,
  },
  {
    type: 'Thought Leadership / Technical',
    headline: 'Building Low-Latency Cloud Systems | GopherCon Speaker | Open-Source Systems Engineer',
    post: `💡 3 lessons from scaling vector retrieval to 10M embeddings with sub-5ms latency:

1. Offload similarity search to pgvector with HNSW rather than running separate disconnected vector DBs.
2. SIMD quantization is the secret weapon for 85% memory reduction.
3. Keep database schema relational + vector unified for fast metadata filtering.

Check out our benchmark repo for full reproduction benchmarks!`,
  },
];

export const LinkedInOptimizer: React.FC = () => {
  const { addToast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    addToast({
      title: 'Copied to Clipboard',
      description: 'Ready to paste directly into LinkedIn!',
      type: 'success',
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              LinkedIn Profile & Post Optimizer
            </h3>
            <p className="text-[11px] text-neutral-400">
              Generates hook/body/CTA variants from verified career graph achievements
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {VARIANTS.map((v, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/70 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 font-mono">
                Variant {idx + 1}: {v.type}
              </span>
              <button
                onClick={() => handleCopy(`${v.headline}\n\n${v.post}`, idx)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-200 font-medium transition-colors"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-neutral-400" />
                    <span>Copy Draft</span>
                  </>
                )}
              </button>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-neutral-500">
                Headline Draft
              </span>
              <p className="text-xs font-medium text-white">{v.headline}</p>
            </div>

            {/* Post Draft */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-neutral-500">
                Engaging Post Draft
              </span>
              <p className="text-xs text-neutral-300 whitespace-pre-line leading-relaxed bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/60">
                {v.post}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
