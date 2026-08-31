'use client';

import React from 'react';
import Link from 'next/link';
import { GitGraph, FileText, Linkedin, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '@karma/ui';

const PILLARS = [
  {
    title: 'Career Timeline & Brag Sheet',
    subtitle: 'Capture what you build as it happens',
    icon: GitGraph,
    color: 'text-indigo-400',
    borderColor: 'hover:border-indigo-500/50',
    description: 'Keep a live record of every major project, bugfix, and architecture change with real metrics (latency dropped, money saved, scale supported).',
    link: '/career',
    features: ['Quick 1-line logging', 'Automatic action & metric formatting', 'Full exportable history in PostgreSQL'],
  },
  {
    title: '1-Page Tailored Resume Builder',
    subtitle: 'Fitted mathematically to one page',
    icon: FileText,
    color: 'text-purple-400',
    borderColor: 'hover:border-purple-500/50',
    description: 'Paste any job posting. Karma pulls your most relevant bullet points and fits them to a clean 1-page template with zero margin hacks.',
    link: '/resume',
    features: ['Targeted keyword matching', 'Strict 1-page character budget', 'Clean ATS-friendly formatting'],
  },
  {
    title: 'Interview & Career Prep Tools',
    subtitle: 'Tailored to your actual experience',
    icon: Linkedin,
    color: 'text-sky-400',
    borderColor: 'hover:border-sky-500/50',
    description: 'Generate realistic interview questions based on your projects, draft cover letters in seconds, and write concise LinkedIn summary bullets.',
    link: '/tools',
    features: ['System design & behavioral mock Qs', 'Company-targeted cover letters', 'LinkedIn headline & post drafts'],
  },
  {
    title: 'Private BYOK Vault',
    subtitle: 'Bring your own API keys',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/50',
    description: 'Use your own OpenAI or Anthropic API key to pay wholesale rates (~$0.01 per resume). Keys are encrypted on the database and never stored in plain text.',
    link: '/vault',
    features: ['Encrypted with AES-256 in PostgreSQL', 'Decrypted only during live requests', 'No recurring $30/mo subscription'],
  },
];

export const PillarsGrid: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Everything in one place</h2>
          <p className="text-xs text-neutral-400">Tools designed to make documenting and advancing your career painless</p>
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
                    <span>Open</span>
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
