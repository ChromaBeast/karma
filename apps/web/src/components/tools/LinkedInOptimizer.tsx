'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

interface Variant {
  type: string;
  headline: string;
  post: string;
}

const DEFAULT_VARIANTS: Variant[] = [
  {
    type: 'High-Impact Metrics',
    headline: 'Senior Backend Engineer | Scaled Go microservices to 100k rps (-90% latency) | PostgreSQL & Distributed Systems',
    post: `🚀 Most backend bottlenecks aren't CPU-bound—they're network roundtrips and unindexed queries.

Recently, our team re-architected our caching layer in Go:
• Replaced unindexed database calls with in-memory TTL caching
• Scaled to 100k requests/sec at under 2ms p99 response time
• Cut cloud database egress costs significantly.

Always measure before optimizing! What is your favorite profiling tool in Go?`,
  },
  {
    type: 'System Design / Technical',
    headline: 'Distributed Systems & Go | Open Source Contributor | Low-Latency Infrastructure',
    post: `💡 3 lessons from optimizing high-throughput Go services:

1. Always use sync.RWMutex for read-heavy in-memory caches to avoid lock contention.
2. Structure database queries with compound indexes before adding external caches.
3. Keep HTTP middleware lightweight with Gzip compression.`,
  },
];

export const LinkedInOptimizer: React.FC = () => {
  const { addToast } = useToast();
  const [roleTitle, setRoleTitle] = useState('Senior Backend Engineer');
  const [skills, setSkills] = useState('Go, PostgreSQL, Distributed Systems, Redis');
  const [variants, setVariants] = useState<Variant[]>(DEFAULT_VARIANTS);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const [hlRes, postRes] = await Promise.all([
        api.generateHeadline(roleTitle, skills).catch(() => null),
        api.generatePost('Distributed Caching Architecture', '100k req/sec at <2ms latency').catch(() => null),
      ]);

      if (hlRes?.headline || postRes?.post_text) {
        setVariants([
          {
            type: 'AI Generated · Tailored',
            headline: hlRes?.headline || `${roleTitle} | ${skills}`,
            post: postRes?.post_text || DEFAULT_VARIANTS[0].post,
          },
          ...DEFAULT_VARIANTS,
        ]);
        addToast({
          title: 'LinkedIn Content Generated',
          description: 'Created headline and post drafts from your background.',
          type: 'success',
        });
      }
    } catch {
      // Keep defaults
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    addToast({
      title: 'Copied to Clipboard',
      description: 'Ready to paste into LinkedIn.',
      type: 'success',
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              LinkedIn Content Generator
            </h3>
            <p className="text-[11px] text-neutral-400">
              Draft headlines and posts tailored to your real engineering background
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium shadow-md shadow-indigo-600/20"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{isLoading ? 'Generating...' : 'Generate Live'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Target Role</label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Core Skills</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {variants.map((v, i) => (
          <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                {v.type}
              </span>
              <button
                onClick={() => handleCopy(v.post, i)}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
              >
                {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === i ? 'Copied' : 'Copy Post'}</span>
              </button>
            </div>
            <div className="text-xs font-semibold text-neutral-200">
              Headline: <span className="text-neutral-400 font-normal">{v.headline}</span>
            </div>
            <pre className="text-xs text-neutral-300 whitespace-pre-wrap font-sans bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/60 leading-relaxed">
              {v.post}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
