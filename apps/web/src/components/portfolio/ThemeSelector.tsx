'use client';

import React from 'react';
import { Palette, Sparkles, Layout, Box } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PortfolioConfig } from '../../lib/types';

const THEMES: { id: PortfolioConfig['themeId']; name: string; desc: string; icon: React.ElementType }[] = [
  { id: 'dark-glass', name: 'Dark Glassmorphism', desc: 'Sleek dark backdrop with frosted glass accents & neon glows', icon: Sparkles },
  { id: 'modern-bento', name: 'Modern Bento Grid', desc: 'Asymmetrical modular cards with proximity lighting', icon: Layout },
  { id: 'minimal', name: 'Minimalist Clean', desc: 'Monochrome high-contrast layout emphasizing system design diagrams', icon: Box },
];

export const ThemeSelector: React.FC = () => {
  const { portfolio, setPortfolio } = useApp();

  return (
    <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          Portfolio Theme Template
        </h3>
      </div>

      <div className="space-y-2">
        {THEMES.map((t) => {
          const Icon = t.icon;
          const isSelected = portfolio.themeId === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setPortfolio((prev) => ({ ...prev, themeId: t.id }))}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/40 shadow-sm'
                  : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white">{t.name}</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">{t.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
