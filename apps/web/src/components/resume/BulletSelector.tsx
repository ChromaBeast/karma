'use client';

import React from 'react';
import { CheckSquare, Square, Star, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const BulletSelector: React.FC = () => {
  const { resume, toggleResumeBullet } = useApp();
  const { addToast } = useToast();

  const handleToggle = (nodeId: string, currentlyIncluded: boolean) => {
    toggleResumeBullet(nodeId);
    addToast({
      title: currentlyIncluded ? 'Bullet Removed' : 'Bullet Included',
      description: 'Knapsack character budget recalculated in real-time.',
      type: 'info',
    });
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Re-Ranked Career Nodes
          </h3>
        </div>
        <span className="text-[10px] text-neutral-500 font-mono">
          Cosine Sim + LLM Re-Rank
        </span>
      </div>

      <div className="space-y-2.5">
        {resume.bullets.map((bullet) => (
          <div
            key={bullet.careerNodeId}
            onClick={() => handleToggle(bullet.careerNodeId, bullet.included)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none space-y-2 ${
              bullet.included
                ? 'border-indigo-500/60 bg-indigo-950/20 shadow-sm'
                : 'border-neutral-800 bg-neutral-950/40 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {bullet.included ? (
                  <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-500 shrink-0" />
                )}
                <span className="text-[11px] font-mono font-semibold text-indigo-300 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Score: {(bullet.rankScore * 100).toFixed(0)}% Match
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">
                {bullet.finalText.length} chars
              </span>
            </div>

            <p className="text-xs text-neutral-200 leading-relaxed pl-6">
              {bullet.finalText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
