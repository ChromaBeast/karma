'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, MonitorPlay, KeyRound, ArrowUpRight } from 'lucide-react';

export const QuickActionsBar: React.FC = () => {
  const ACTIONS = [
    {
      title: 'Build ATS Tailored Resume',
      desc: 'Ingest new JD and fit top career nodes into strict 1-page character knapsack.',
      href: '/resume',
      icon: FileText,
      color: 'from-indigo-600/20 to-indigo-900/40 border-indigo-500/30',
    },
    {
      title: 'Generate Proof Mockup',
      desc: 'Frame your architecture dashboards & live code pipelines in 2D device frames.',
      href: '/mockups',
      icon: MonitorPlay,
      color: 'from-purple-600/20 to-purple-900/40 border-purple-500/30',
    },
    {
      title: 'Manage BYOK Vault Keys',
      desc: 'Seal your Anthropic, OpenAI, or Gemini keys with AES-256 envelope encryption.',
      href: '/vault',
      icon: KeyRound,
      color: 'from-emerald-600/20 to-emerald-900/40 border-emerald-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {ACTIONS.map((a, idx) => {
        const Icon = a.icon;
        return (
          <Link key={idx} href={a.href}>
            <div className={`p-5 rounded-2xl border bg-gradient-to-br ${a.color} transition-all hover:scale-[1.02] hover:shadow-xl group space-y-2`}>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-700/50 text-white">
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                {a.title}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {a.desc}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
