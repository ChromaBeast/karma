'use client';

import React, { useState } from 'react';
import { MockupControls } from '../../components/mockups/MockupControls';
import { MockupCanvas } from '../../components/mockups/MockupCanvas';
import { DecryptedText } from '@karma/ui';

const SAMPLE_CODE = `// Ingest career milestone into pgvector graph
func (s *CareerService) StructureEvent(ctx context.Context, raw string) (*CareerNode, error) {
    embedding := s.embedder.Compute(raw)
    node := &CareerNode{
        ID:        uuid.New(),
        Metrics:   ExtractMetrics(raw),
        Embedding: embedding,
        CreatedAt: time.Now().UTC(),
    }
    return s.repo.Create(ctx, node)
}`;

export default function MockupsPage() {
  const [mode, setMode] = useState<'screenshot' | 'code' | 'metric'>('code');
  const [codeSnippet, setCodeSnippet] = useState(SAMPLE_CODE);
  const [codeLang, setCodeLang] = useState('Go');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Visual Proof &amp; Code Studio
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-400">
              <DecryptedText text="Multi-Mode Proof Engine" speed={25} />
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Render high-fidelity code snippets, device frames, and benchmark cards for your portfolio and resumes.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Controls */}
        <div className="lg:col-span-5">
          <MockupControls
            mode={mode}
            setMode={setMode}
            codeSnippet={codeSnippet}
            setCodeSnippet={setCodeSnippet}
            codeLang={codeLang}
            setCodeLang={setCodeLang}
          />
        </div>

        {/* Right: Live Canvas Renderer */}
        <div className="lg:col-span-7">
          <MockupCanvas
            mode={mode}
            codeSnippet={codeSnippet}
            codeLang={codeLang}
          />
        </div>
      </div>
    </div>
  );
}
