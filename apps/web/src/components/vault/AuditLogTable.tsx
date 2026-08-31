'use client';

import React from 'react';
import { History, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuditLogTable: React.FC = () => {
  const { executions } = useApp();

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            LLM Execution Audit Trail
          </h3>
        </div>
        <span className="text-[10px] font-mono text-neutral-500">
          Last {executions.length} calls
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-500 text-[10px] uppercase font-mono">
              <th className="pb-2 font-medium">Timestamp</th>
              <th className="pb-2 font-medium">Module</th>
              <th className="pb-2 font-medium">Provider & Model</th>
              <th className="pb-2 font-medium">Tokens</th>
              <th className="pb-2 font-medium">Cost (USD)</th>
              <th className="pb-2 font-medium">Latency</th>
              <th className="pb-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
            {executions.map((e) => (
              <tr key={e.id} className="hover:bg-neutral-800/30 transition-colors">
                <td className="py-2.5 text-neutral-400">
                  {new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-2.5 font-sans font-medium text-white">{e.module}</td>
                <td className="py-2.5 text-indigo-300">{e.model}</td>
                <td className="py-2.5 text-neutral-300">
                  {(e.promptTokens + e.completionTokens).toLocaleString()}
                </td>
                <td className="py-2.5 text-emerald-400">${e.costUsd.toFixed(4)}</td>
                <td className="py-2.5 text-neutral-400">{e.latencyMs}ms</td>
                <td className="py-2.5 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    <CheckCircle className="w-2.5 h-2.5" />
                    {e.cacheHit ? 'Cache Hit' : 'Success'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
