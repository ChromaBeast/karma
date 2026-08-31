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
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            The developer brag document that builds your resumes and portfolio as you ship.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Operational on Neon + Go</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="font-bold text-white text-xs uppercase tracking-wider">Features</div>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/career" className="hover:text-white transition-colors">Career Timeline</Link></li>
            <li><Link href="/resume" className="hover:text-white transition-colors">1-Page Resume Builder</Link></li>
            <li><Link href="/mockups" className="hover:text-white transition-colors">Proof Mockups</Link></li>
            <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio CMS</Link></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <div className="font-bold text-white text-xs uppercase tracking-wider">Privacy &amp; Security</div>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/vault" className="hover:text-white transition-colors flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AES-256 Key Vault</Link></li>
            <li><span className="text-neutral-500">PostgreSQL + pgvector</span></li>
            <li><span className="text-neutral-500">Go API Gateway</span></li>
            <li><span className="text-neutral-500">Export Anytime (JSON/MD)</span></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <div className="font-bold text-white text-xs uppercase tracking-wider">Open Source</div>
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
            <li><Link href="/tools" className="hover:text-white transition-colors">Interview &amp; Career Tools</Link></li>
          </ul>
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
        <div>&copy; {new Date().getFullYear()} Karma. MIT License.</div>
        <div className="flex items-center gap-1">
          <span>Built for developers with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </div>
      </div>
    </footer>
  );
};
