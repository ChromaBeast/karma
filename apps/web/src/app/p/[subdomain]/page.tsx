'use client';

import React from 'react';
import { ExternalLink, Github, Linkedin, Mail, Sparkles, Terminal, Code2, Globe } from 'lucide-react';
import { ShinyText, SpotlightCard } from '@karma/ui';

interface PublicPortfolioProps {
  params: { subdomain: string };
}

export default function PublicPortfolioPage({ params }: PublicPortfolioProps) {
  const { subdomain } = params;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Header Hero */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 font-mono">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{subdomain}.karma.app</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Alex Chen
            </h1>
            <p className="text-base sm:text-lg text-indigo-300 font-medium">
              <ShinyText text="Staff Backend Architect & Distributed Systems Engineer" speed={4} />
            </p>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              I design high-throughput microservices, vector search infrastructure, and zero-downtime distributed databases in Go, Rust, and PostgreSQL.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-300 border border-neutral-800 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-300 border border-neutral-800 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="mailto:alex.chen@karma.app"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-xs font-medium text-indigo-300 border border-indigo-500/30 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </a>
          </div>
        </header>

        {/* Shipped Work & Projects */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Shipped Architectures</h2>
            </div>
            <span className="text-xs font-mono text-neutral-500">Verified Proof</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SpotlightCard className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  90% Latency Drop
                </span>
                <Terminal className="w-4 h-4 text-neutral-500" />
              </div>
              <h3 className="text-base font-bold text-white">Distributed In-Memory Cache Cluster</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Architected thread-safe TTL cache layer in Go with janitor eviction, scaling query throughput to 100k req/sec with &lt;2ms response times.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-mono text-neutral-400">
                <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">Go</span>
                <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">Concurrency</span>
                <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">Redis</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/50">
                  Sub-5ms Search
                </span>
                <ExternalLink className="w-4 h-4 text-neutral-500" />
              </div>
              <h3 className="text-base font-bold text-white">PostgreSQL Vector Search Retrieval</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Integrated pgvector with 1536-dimensional cosine embeddings, enabling semantic resume and career node matching across 10M vectors.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-mono text-neutral-400">
                <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">PostgreSQL</span>
                <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">pgvector</span>
                <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">SIMD</span>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500">
          <div>Published with Karma Portfolio CMS</div>
          <div className="flex items-center gap-1 text-indigo-400 font-medium">
            <Sparkles className="w-3 h-3" />
            <span>karma.app</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
