'use client';

import React from 'react';
import { Layers, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KnapsackBar: React.FC = () => {
  const { resume } = useApp();

  const percentage = Math.min(
    Math.round((resume.characterCount / resume.maxCharacterBudget) * 100),
    120
  );

  const isOverBudget = resume.characterCount > resume.maxCharacterBudget;
  const isOptimal = percentage >= 75 && percentage <= 100;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-white">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>1-Page Resume Character Budget</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className={`font-semibold ${isOverBudget ? 'text-rose-400' : 'text-neutral-200'}`}>
            {resume.characterCount.toLocaleString()}
          </span>
          <span className="text-neutral-500">/ {resume.maxCharacterBudget.toLocaleString()} chars</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-semibold ${
            isOverBudget
              ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
              : isOptimal
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
              : 'bg-amber-950 text-amber-300 border border-amber-800/60'
          }`}>
            {percentage}% Fitted
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 rounded-full bg-neutral-800 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isOverBudget
              ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
              : isOptimal
              ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
              : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
        <span>Fitted to fill 1 page cleanly without spilling onto page 2.</span>
        {isOverBudget ? (
          <span className="text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Page 2 overflow risk
          </span>
        ) : (
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Clean 1-page fit
          </span>
        )}
      </div>
    </div>
  );
};
