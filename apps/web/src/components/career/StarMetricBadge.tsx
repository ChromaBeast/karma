'use client';

import React from 'react';
import { DollarSign, TrendingUp, Server, Zap } from 'lucide-react';
import { CareerMetrics } from '../../lib/types';

interface StarMetricBadgeProps {
  metrics: CareerMetrics;
}

export const StarMetricBadge: React.FC<StarMetricBadgeProps> = ({ metrics }) => {
  const items: { label: string; value: string; icon: React.ElementType; color: string }[] = [];

  if (metrics.dollarSaved) {
    items.push({
      label: 'Saved',
      value: metrics.dollarSaved,
      icon: DollarSign,
      color: 'border-emerald-800/60 bg-emerald-950/40 text-emerald-300',
    });
  }
  if (metrics.percentGrowth) {
    items.push({
      label: 'Growth',
      value: metrics.percentGrowth,
      icon: TrendingUp,
      color: 'border-cyan-800/60 bg-cyan-950/40 text-cyan-300',
    });
  }
  if (metrics.scale) {
    items.push({
      label: 'Scale',
      value: metrics.scale,
      icon: Server,
      color: 'border-indigo-800/60 bg-indigo-950/40 text-indigo-300',
    });
  }
  if (metrics.latencyReduction) {
    items.push({
      label: 'Latency',
      value: metrics.latencyReduction,
      icon: Zap,
      color: 'border-amber-800/60 bg-amber-950/40 text-amber-300',
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <span
            key={idx}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-medium font-mono ${item.color}`}
          >
            <Icon className="w-2.5 h-2.5" />
            <span className="font-semibold">{item.value}</span>
          </span>
        );
      })}
    </div>
  );
};
