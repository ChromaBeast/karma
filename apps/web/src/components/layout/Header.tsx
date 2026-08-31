'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { ShinyText } from '@karma/ui';
import { UserDropdown } from '../auth/UserDropdown';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();

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

        {/* Right Actions: See Pricing & Sign In / Dashboard */}
        <div className="flex items-center gap-3">
          {/* See Pricing Link */}
          <Link
            href="/#pricing"
            className="text-xs font-semibold text-neutral-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all"
          >
            See Pricing
          </Link>

          {/* Logged-In Direct Dashboard Shortcut */}
          {user && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {/* User Profile Dropdown / Sign In Trigger */}
          <UserDropdown />
        </div>
      </header>

      <AuthModal />
    </>
  );
};
