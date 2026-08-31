'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitGraph,
  FileText,
  MonitorPlay,
  Globe2,
  KeyRound,
  Wand2,
} from 'lucide-react';
import { cn } from '@karma/ui';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/career', label: 'Career Graph', icon: GitGraph, badge: 'Active' },
  { href: '/resume', label: 'ATS Resumes', icon: FileText },
  { href: '/mockups', label: 'Proof Mockups', icon: MonitorPlay },
  { href: '/portfolio', label: 'Portfolio CMS', icon: Globe2 },
  { href: '/vault', label: 'BYOK Vault', icon: KeyRound },
  { href: '/tools', label: 'Career Tools', icon: Wand2 },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-950/40 p-4 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          Core Engine
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform group-hover:scale-110',
                      isActive ? 'text-indigo-400' : 'text-neutral-500'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-950 text-indigo-400 font-semibold border border-indigo-800/50">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Storage / Plan Indicator */}
      <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Graph Capacity</span>
          <span className="font-mono text-neutral-200 font-medium">3 / 500 nodes</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div className="h-full bg-indigo-500 w-[6%]" />
        </div>
        <p className="text-[10px] text-neutral-500">
          1-Time Access License Active
        </p>
      </div>
    </aside>
  );
};
