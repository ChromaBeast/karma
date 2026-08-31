'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { SpotlightCard } from '@karma/ui';

const TESTIMONIALS = [
  {
    name: 'Marcus Vance',
    role: 'Senior Backend Engineer',
    company: 'FinTech',
    text: 'I used to dread writing self-reviews every December because I couldn’t remember what I shipped in March. Now I drop a quick 1-line note right after merging a major PR.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
  },
  {
    name: 'Elena Rostova',
    role: 'Infrastructure Engineer',
    company: 'Cloud Platform',
    text: 'The 1-page resume constraint actually works. It picks only the accomplishments that fit the job description and cuts out the fluff without me messing with 9pt font margins.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
  },
  {
    name: 'Devin Thorne',
    role: 'Full-Stack Developer',
    company: 'Startup Founder',
    text: 'Bringing my own OpenAI and Anthropic keys without getting locked into a $30/month subscription was the deciding factor. Simple, fast, and stays out of the way.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <div className="space-y-6 pt-4">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          What engineers say
        </h2>
        <p className="text-xs text-neutral-400">
          Used by developers to keep their brag sheets updated and resumes ready.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t) => (
          <SpotlightCard
            key={t.name}
            className="p-6 rounded-3xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-normal italic">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-neutral-800/80">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-9 h-9 rounded-full object-cover border border-neutral-700"
              />
              <div>
                <div className="text-xs font-bold text-white">{t.name}</div>
                <div className="text-[11px] text-neutral-400">{t.role}</div>
                <div className="text-[10px] text-indigo-400 font-medium">{t.company}</div>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};
