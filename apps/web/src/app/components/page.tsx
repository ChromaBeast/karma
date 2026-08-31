'use client';

import React, { useState } from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';
import { ShinyText, DecryptedText, SpotlightCard } from '@karma/ui';
import { ComponentCard } from '../../components/showcase/ComponentCard';
import { ShowcaseFilter, ShowcaseCategory } from '../../components/showcase/ShowcaseFilter';
import { CodeMockupView } from '../../components/mockups/CodeMockupView';

export default function ComponentsShowcasePage() {
  const [category, setCategory] = useState<ShowcaseCategory>('all');

  const components = [
    {
      name: 'ShinyText',
      category: 'text',
      description: 'Dynamic metallic shimmer animation on text',
      codeSnippet: `<ShinyText text="Staff Distributed Systems Architect" speed={3} />`,
      preview: (
        <span className="text-base font-bold text-white">
          <ShinyText text="Staff Distributed Systems Architect" speed={3} />
        </span>
      ),
    },
    {
      name: 'DecryptedText',
      category: 'text',
      description: 'Cyberpunk cipher unscrambling text reveal',
      codeSnippet: `<DecryptedText text="100,000 req/sec at <2ms latency" speed={30} />`,
      preview: (
        <span className="text-sm font-mono font-semibold text-emerald-400">
          <DecryptedText text="100,000 req/sec at <2ms latency" speed={30} />
        </span>
      ),
    },
    {
      name: 'SpotlightCard',
      category: 'cards',
      description: 'Radial cursor proximity lighting with frosted glass border',
      codeSnippet: `<SpotlightCard className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">\n  <div className="text-xs font-bold text-white">High-Throughput Sharding</div>\n</SpotlightCard>`,
      preview: (
        <SpotlightCard className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 text-center max-w-xs space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-indigo-400 text-xs font-bold">
            <Cpu className="w-4 h-4" />
            <span>High-Throughput Sharding</span>
          </div>
          <p className="text-[11px] text-neutral-400">Proximity spotlight glow tracks mouse cursor.</p>
        </SpotlightCard>
      ),
    },
    {
      name: 'CodeEditorFrame',
      category: 'frames',
      description: 'macOS terminal window with syntax highlighting and line numbers',
      codeSnippet: `<CodeMockupView\n  code="func Scale() { return true }"\n  language="Go"\n  filename="main.go"\n  theme="one-dark"\n/>`,
      preview: (
        <div className="w-full max-w-xs scale-90">
          <CodeMockupView
            code={`// Scaled proxy\nfunc Route() bool {\n  return true\n}`}
            language="Go"
            filename="proxy.go"
            theme="one-dark"
          />
        </div>
      ),
    },
    {
      name: 'TerminalProofBadge',
      category: 'cards',
      description: 'Cryptographic proof status badge with status icon',
      codeSnippet: `<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-mono">\n  <ShieldCheck className="w-4 h-4" />\n  <span>PGVector Verified</span>\n</div>`,
      preview: (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-mono shadow-lg shadow-emerald-950/40">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PGVector 1536-dim Verified</span>
        </div>
      ),
    },
  ];

  const filtered = category === 'all' ? components : components.filter((c) => c.category === category);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Component &amp; UI Gallery
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
              Interactive Design System
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Test, inspect, and copy modular ReactBits components and device frames used across Karma.
          </p>
        </div>

        <ShowcaseFilter currentCategory={category} onSelectCategory={setCategory} />
      </div>

      {/* Grid of Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((comp) => (
          <ComponentCard
            key={comp.name}
            name={comp.name}
            category={comp.category}
            description={comp.description}
            codeSnippet={comp.codeSnippet}
            preview={comp.preview}
          />
        ))}
      </div>
    </div>
  );
}
