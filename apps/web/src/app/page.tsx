'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '../components/landing/HeroSection';
import { PillarsGrid } from '../components/landing/PillarsGrid';
import { PricingSection } from '../components/landing/PricingSection';
import { OverviewMetrics } from '../components/dashboard/OverviewMetrics';
import { QuickActionsBar } from '../components/dashboard/QuickActionsBar';
import { CareerNodeCard } from '../components/career/CareerNodeCard';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { nodes } = useApp();

  return (
    <div className="relative min-h-screen p-6 max-w-7xl mx-auto space-y-10">
      {/* Hero Welcome & Value Proposition */}
      <HeroSection />

      {/* Overview Metrics Bar */}
      <OverviewMetrics />

      {/* Four Core Architectural Pillars */}
      <PillarsGrid />

      {/* Quick Actions & Automation */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
          Product Modules & Workflows
        </h3>
        <QuickActionsBar />
      </div>

      {/* Recent Career Graph Artifacts */}
      {nodes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-bold text-white">Live Career Graph Nodes</h3>
              <p className="text-xs text-neutral-500">Structured STAR & XYZ achievement nodes in Neon PostgreSQL</p>
            </div>
            <Link
              href="/career"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>View All ({nodes.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nodes.slice(0, 2).map((node) => (
              <CareerNodeCard key={node.id} node={node} />
            ))}
          </div>
        </div>
      )}

      {/* Pricing / Access Tiers */}
      <PricingSection />
    </div>
  );
}
