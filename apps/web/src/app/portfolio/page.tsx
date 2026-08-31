'use client';

import React from 'react';
import { Rocket } from 'lucide-react';
import { ThemeSelector } from '../../components/portfolio/ThemeSelector';
import { DomainSettings } from '../../components/portfolio/DomainSettings';
import { LivePortfolioPreview } from '../../components/portfolio/LivePortfolioPreview';
import { useToast } from '../../context/ToastContext';
import { DecryptedText } from '@karma/ui';

export default function PortfolioPage() {
  const { addToast } = useToast();

  const handlePublish = () => {
    addToast({
      title: 'Portfolio Published & Deployed',
      description: 'Triggered SSG build hook on edge CDN. Live at custom subdomain.',
      type: 'success',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Portfolio Website Configurator
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
              <DecryptedText text="Static-First Edge SSG" speed={25} />
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Publish your career graph proof to a fast, cost-free edge portfolio site.
          </p>
        </div>

        <button
          onClick={handlePublish}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Rocket className="w-4 h-4" />
          <span>Publish & Deploy Live</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Theme Picker & Custom Domain */}
        <div className="lg:col-span-5 space-y-4">
          <ThemeSelector />
          <DomainSettings />
        </div>

        {/* Right Column: Responsive Live Preview */}
        <div className="lg:col-span-7">
          <LivePortfolioPreview />
        </div>
      </div>
    </div>
  );
}
