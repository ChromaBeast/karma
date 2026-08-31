'use client';

import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Sparkles, Terminal, Code2, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { ShinyText, SpotlightCard } from '@karma/ui';
import { api } from '../../../lib/api';

interface PublicPortfolioProps {
  params: { subdomain: string };
}

interface PublicProject {
  title: string;
  type: string;
  result: string;
  tags: string[];
}

export default function PublicPortfolioPage({ params }: PublicPortfolioProps) {
  const { subdomain } = params;
  const [portfolioData, setPortfolioData] = useState<{
    subdomain: string;
    themeId: string;
    config?: { name?: string; headline?: string; bio?: string };
    projects?: PublicProject[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await api.getPublicPortfolio(subdomain);
        if (res) {
          setPortfolioData(res);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadPortfolio();
  }, [subdomain]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-xs font-mono">Resolving {subdomain}.karma.app...</p>
      </div>
    );
  }

  if (notFound || !portfolioData) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-neutral-600" />
        <h1 className="text-lg font-bold text-white">Portfolio Not Found</h1>
        <p className="text-xs text-neutral-400 max-w-sm">
          The subdomain <code className="text-indigo-400 font-mono">{subdomain}.karma.app</code> has not been published yet or is inactive.
        </p>
      </div>
    );
  }

  const name = portfolioData.config?.name || subdomain.replace(/-/g, ' ').toUpperCase();
  const headline = portfolioData.config?.headline || 'Software Engineer & Builder';
  const bio = portfolioData.config?.bio || `Verified engineering achievements and architecture proof for ${name}.`;
  const projects = portfolioData.projects || [];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16 space-y-12">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 font-mono">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{subdomain}.karma.app</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{name}</h1>
            <p className="text-base sm:text-lg text-indigo-300 font-medium">
              <ShinyText text={headline} speed={4} />
            </p>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">{bio}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-300 border border-neutral-800 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-300 border border-neutral-800 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${subdomain}@karma.app`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-xs font-medium text-indigo-300 border border-indigo-500/30 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
          </div>
        </header>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Shipped Work &amp; Systems</h2>
            </div>
            <span className="text-xs font-mono text-neutral-500">{projects.length} Verified Projects</span>
          </div>

          {projects.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-neutral-800 text-center text-neutral-500 text-xs">
              No public projects featured yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p, idx) => (
                <SpotlightCard key={idx} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/50 uppercase">
                      {p.type}
                    </span>
                    <Terminal className="w-4 h-4 text-neutral-500" />
                  </div>
                  <h3 className="text-base font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">{p.result}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-mono text-neutral-400">
                    {p.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </section>

        <footer className="pt-8 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500">
          <div>Verified with Karma Career Graph</div>
          <div className="flex items-center gap-1 text-indigo-400 font-medium">
            <Sparkles className="w-3 h-3" />
            <span>karma.app</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
