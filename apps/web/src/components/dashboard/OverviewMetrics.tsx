'use client';

import React from 'react';
import { GitGraph, FileText, KeyRound, Globe2, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CountUp, SpotlightCard } from '@karma/ui';

export const OverviewMetrics: React.FC = () => {
  const { nodes, resume, vaultKeys, portfolio } = useApp();

  const activeKeys = vaultKeys.filter((k) => k.isActive).length;

  const STATS = [
    {
      label: 'Career Nodes in Graph',
      value: nodes.length,
      unit: '',
      change: '+2 this week',
      icon: GitGraph,
      color: 'text-indigo-400',
    },
    {
      label: 'ATS Knapsack Match',
      value: resume.atsScore,
      decimals: 1,
      unit: '%',
      change: '1-Page Compliant',
      icon: FileText,
      color: 'text-emerald-400',
    },
    {
      label: 'BYOK Active Providers',
      value: activeKeys,
      unit: ` / ${vaultKeys.length}`,
      change: 'AES-256 Sealed',
      icon: KeyRound,
      color: 'text-amber-400',
    },
    {
      label: 'Edge Portfolio Status',
      customText: portfolio.published ? 'Live' : 'Draft',
      change: `${portfolio.subdomain}.karma.app`,
      icon: Globe2,
      color: 'text-cyan-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <SpotlightCard key={idx} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">{stat.label}</span>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>

            <div className="flex items-baseline gap-1">
              {stat.customText ? (
                <span className="text-2xl font-bold text-white">{stat.customText}</span>
              ) : (
                <span className="text-2xl font-bold font-mono text-white">
                  <CountUp to={stat.value!} decimals={stat.decimals || 0} suffix={stat.unit} />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>{stat.change}</span>
            </div>
          </SpotlightCard>
        );
      })}
    </div>
  );
};
