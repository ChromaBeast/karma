'use client';

import React from 'react';
import { CheckSquare, Square, Star, Sparkles, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const BulletSelector: React.FC = () => {
  const { resume, toggleResumeBullet } = useApp();
  const { addToast } = useToast();

  const handleToggle = (nodeId: string, currentlyIncluded: boolean) => {
    toggleResumeBullet(nodeId);
    addToast({
      title: currentlyIncluded ? 'Bullet Point Removed' : 'Bullet Point Added',
      description: 'Page character count recalculated in real time.',
      type: 'info',
    });
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Tailored Bullet Points
          </h3>
        </div>
        <span className="text-[10px] text-neutral-400 font-medium">
          {resume.bullets.length > 0 ? `${resume.bullets.length} available` : '0 available'}
        </span>
      </div>

      {resume.bullets.length === 0 ? (
        <div className="p-6 text-center rounded-xl border border-dashed border-neutral-800 bg-neutral-950/40 space-y-2">
          <PlusCircle className="w-6 h-6 text-neutral-600 mx-auto" />
          <p className="text-xs font-semibold text-neutral-300">No achievements generated yet</p>
          <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
            Click &quot;Target Job&quot; above to match your achievements against a job posting.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
};
