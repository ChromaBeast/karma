'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Plus } from 'lucide-react';
import { ShinyText } from '@karma/ui';
import { EventCaptureModal } from '../career/EventCaptureModal';
import { UserDropdown } from '../auth/UserDropdown';
import { AuthModal } from '../auth/AuthModal';

export const Header: React.FC = () => {
  const [showCapture, setShowCapture] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-6 backdrop-blur-xl">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              K
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Karma
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
                  v1.0
                </span>
              </span>
              <span className="text-[10px] text-neutral-500 hidden sm:inline-block">
                <ShinyText text="Your work, compounding." speed={4} />
              </span>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* BYOK Security Status Pill */}
          <Link
            href="/vault"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-900/60 bg-emerald-950/30 text-emerald-400 text-xs font-medium hover:bg-emerald-950/50 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>BYOK Vault</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </Link>

          {/* Quick Capture Event Button */}
          <button
            onClick={() => setShowCapture(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Capture Event</span>
          </button>

          {/* User Profile / Auth State */}
          <div className="pl-2 border-l border-neutral-800">
            <UserDropdown />
          </div>
        </div>
      </header>

      {showCapture && <EventCaptureModal onClose={() => setShowCapture(false)} />}
      <AuthModal />
    </>
  );
};
