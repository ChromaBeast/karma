'use client';

import React from 'react';
import { Clock, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EventPoller: React.FC = () => {
  const { events } = useApp();

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-3.5 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Real-time event parser active — captured notes are structured in background.</span>
        </div>
        <span className="font-mono text-[10px] text-neutral-500">Pipeline Ready</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Ingestion Event Pipeline
          </h3>
        </div>
        <span className="text-[10px] text-neutral-500 font-mono">
          {events.length} logged
        </span>
      </div>

      <div className="space-y-2">
        {events.slice(0, 3).map((evt) => (
          <div
            key={evt.id}
            className="flex items-start justify-between gap-3 p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/60 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-neutral-800 text-neutral-300">
                  {evt.captureChannel}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-neutral-300 line-clamp-1 leading-snug">
                {evt.rawText}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-1 mt-1">
              {evt.status === 'completed' ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
                  <CheckCircle2 className="w-3 h-3" /> Structured
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-800/40 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Structuring...
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
