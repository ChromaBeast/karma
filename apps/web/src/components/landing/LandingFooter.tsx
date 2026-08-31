'use client';

import React from 'react';
import Link from 'next/link';
import { Github, ShieldCheck, Heart } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="pt-12 pb-8 border-t border-neutral-800/80 text-neutral-400 text-xs space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="space-y-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-indigo-500/20">
              K
            </div>
            <span className="font-bold text-white text-sm">Karma</span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            The Career Compounding Operating System. Turn what you ship into career equity.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Systems Operational</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="font-bold text-white text-xs uppercase tracking-wider">Product</div>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/career" className="hover:text-white transition-colors">Career Graph</Link></li>
            <li><Link href="/resume" className="hover:text-white transition-colors">ATS Knapsack Engine</Link></li>
            <li><Link href="/mockups" className="hover:text-white transition-colors">Proof Mockup Studio</Link></li>
            <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio Hub</Link></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <div className="font-bold text-white text-xs uppercase tracking-wider">Security & Tech</div>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/vault" className="hover:text-white transition-colors flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> BYOK Envelope Vault</Link></li>
            <li><span className="text-neutral-500">Neon PostgreSQL + pgvector</span></li>
            <li><span className="text-neutral-500">Go API Gateway</span></li>
            <li><span className="text-neutral-500">Zero-Lock-in UI</span></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <div className="font-bold text-white text-xs uppercase tracking-wider">Community</div>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <a
                href="https://github.com/ChromaBeast/karma"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            </li>
            <li><Link href="/tools" className="hover:text-white transition-colors">Career Tools</Link></li>
          </ul>
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
        <div>&copy; {new Date().getFullYear()} Karma. Released under MIT License.</div>
        <div className="flex items-center gap-1">
          <span>Crafted for high-output builders with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </div>
      </div>
    </footer>
  );
};
