'use client';

import React, { useState } from 'react';
import { Laptop, Tablet, Smartphone, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LivePortfolioPreview: React.FC = () => {
  const { portfolio, nodes } = useApp();
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const viewportWidth =
    device === 'desktop' ? 'w-full' : device === 'tablet' ? 'max-w-[560px]' : 'max-w-[340px]';

  return (
    <div className="space-y-3">
      {/* Device Viewport Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              device === 'desktop' ? 'bg-indigo-600 text-white' : 'text-neutral-400'
            }`}
            title="Desktop View"
          >
            <Laptop className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              device === 'tablet' ? 'bg-indigo-600 text-white' : 'text-neutral-400'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              device === 'mobile' ? 'bg-indigo-600 text-white' : 'text-neutral-400'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
          Theme: <span className="text-indigo-400 font-semibold uppercase">{portfolio.themeId}</span>
        </span>
      </div>

      {/* Rendered Viewport Frame */}
      <div className="flex justify-center rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 min-h-[500px]">
        <div
          className={`w-full ${viewportWidth} rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden shadow-2xl transition-all duration-300`}
        >
          {/* Portfolio Simulated Browser Navbar */}
          <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] font-mono text-neutral-500 truncate max-w-[200px]">
              https://{portfolio.subdomain}.karma.app
            </span>
            <div className="w-8" />
          </div>

          {/* Portfolio Body Content */}
          <div className="p-6 space-y-6 text-neutral-100">
            {/* Hero */}
            <div className="space-y-2 border-b border-neutral-800 pb-5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800 text-[10px] text-indigo-300 font-mono">
                <Sparkles className="w-3 h-3" /> Available for Staff / Principal Eng
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Alex Mercer
              </h1>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Staff Systems Architect specializing in Go, distributed storage, and multi-tenant pgvector indexing.
              </p>
            </div>

            {/* Featured Projects Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Shipped Systems & Proof
              </h3>
              <div className="space-y-3">
                {nodes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-semibold text-white">{n.title}</h4>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">{n.nodeType}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">{n.result}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {n.tags.map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
