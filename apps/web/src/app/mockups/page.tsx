'use client';

import React from 'react';
import { MockupControls } from '../../components/mockups/MockupControls';
import { MockupCanvas } from '../../components/mockups/MockupCanvas';
import { DecryptedText } from '@karma/ui';

export default function MockupsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Visual Proof Mockup Generator
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-400">
              <DecryptedText text="Native 2D Canvas Engine" speed={25} />
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Render high-fidelity device frames and social preview cards for portfolio projects.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Controls */}
        <div className="lg:col-span-5">
          <MockupControls />
        </div>

        {/* Right: Live Canvas Renderer */}
        <div className="lg:col-span-7">
          <MockupCanvas />
        </div>
      </div>
    </div>
  );
}
