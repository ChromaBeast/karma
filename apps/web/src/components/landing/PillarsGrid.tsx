'use client';

import React from 'react';
import Link from 'next/link';
import { GitGraph, FileText, Linkedin, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '@karma/ui';

const PILLARS = [
  {
    title: 'Dynamic Career Graph',
    subtitle: 'Event-Driven Capture & Vector Embedding',
    icon: GitGraph,
    color: 'text-indigo-400',
    borderColor: 'hover:border-indigo-500/50',
    description: 'Every commit, launch, or win is logged into an immutable event queue. Background workers extract STAR/XYZ metrics and index embeddings with pgvector.',
    link: '/career',
    features: ['STAR/XYZ structuring', 'pgvector cosine retrieval', 'Immutable event logs'],
  },
  {
    title: 'ATS-Tailored Resume Engine',
    subtitle: 'Greedy Knapsack Character Optimizer',
    icon: FileText,
    color: 'text-purple-400',
    borderColor: 'hover:border-purple-500/50',
    description: 'Parse any job description, retrieve the highest-matching career nodes, and pack achievements into a strict single-page character budget without overflow.',
    link: '/resume',
    features: ['Single-page character budget', 'JD semantic keyword match', 'ATS-compliant layout'],
  },
  {
    title: 'LinkedIn Optimization Suite',
    subtitle: 'High-Impact Headlines & Thought Leadership',
    icon: Linkedin,
    color: 'text-sky-400',
    borderColor: 'hover:border-sky-500/50',
    description: 'Transform shipped projects into viral copy-ready thought leadership posts, keyword-front-loaded experience bullets, and optimized headlines.',
    link: '/tools',
    features: ['Thought leadership drafter', 'Experience bullet optimizer', 'Mock interview simulations'],
  },
  {
    title: 'BYOK Security Vault',
    subtitle: 'AES-256-GCM Envelope Encryption',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/50',
    description: 'Bring Your Own Keys with hardware-backed envelope encryption. Outbound calls are restricted to allow-listed LLM provider URLs at the network layer.',
    link: '/vault',
    features: ['Per-user data keys', 'Network base-URL lock', 'KMS envelope encryption'],
  },
];

export const PillarsGrid: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Core Architecture Pillars</h2>
          <p className="text-xs text-neutral-400">Production-grade modules designed to compound your professional equity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <SpotlightCard
              key={pillar.title}
              className={`p-6 rounded-3xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md transition-all ${pillar.borderColor} flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700/80 flex items-center justify-center ${pillar.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Link
                    href={pillar.link}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                  <p className="text-xs text-neutral-400 font-medium">{pillar.subtitle}</p>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 space-y-1.5">
                {pillar.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};
