'use client';

import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface OnboardingStep2Props {
  achievement: string;
  setAchievement: (a: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const SAMPLE_PROMPTS = [
  'Architected in-memory caching in Go with sync.RWMutex, handling 100k req/sec at <2ms p99 latency.',
  'Migrated monolithic authentication to JWT tokens with bcrypt, reducing database auth load 60%.',
  'Implemented pgvector cosine search across 50k documents, cutting query turnaround from 800ms to 45ms.',
];

export const OnboardingStep2: React.FC<OnboardingStep2Props> = ({
  achievement,
  setAchievement,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/40">
          Step 2 of 3 &middot; Work Ingestion
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight pt-2">
          Log your first engineering milestone
        </h2>
        <p className="text-xs text-neutral-400">
          Describe a project, PR, or architecture decision. Karma will structure it into STAR metrics.
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            What did you build or scale?
          </label>
          <textarea
            rows={5}
            value={achievement}
            onChange={(e) => setAchievement(e.target.value)}
            placeholder="e.g. Replaced unindexed database calls with in-memory TTL caching, scaled to 100k rps at under 2ms latency..."
            className="w-full p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] font-medium text-neutral-400">
            Or pick a sample milestone:
          </label>
          <div className="space-y-1.5">
            {SAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setAchievement(prompt)}
                className="w-full text-left p-2.5 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900 text-[11px] text-neutral-300 transition-colors line-clamp-1"
              >
                &quot;{prompt}&quot;
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            onClick={onNext}
            disabled={!achievement.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Structure &amp; Generate Value</span>
          </button>
        </div>
      </div>
    </div>
  );
};
