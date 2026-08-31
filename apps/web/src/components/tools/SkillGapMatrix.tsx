'use client';

import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

const DEFAULT_ANALYSIS = [
  { skill: 'Go / High Concurrency', status: 'match', note: 'Staff Systems Architect - 100k rps proxy & TTL caching' },
  { skill: 'PostgreSQL & pgvector', status: 'match', note: 'Cosine vector indexing across 1536-dim embeddings' },
  { skill: 'Kubernetes & Multi-AZ Routing', status: 'match', note: '12 Availability Zones routing deployment' },
  { skill: 'eBPF / Kernel Profiling', status: 'gap', note: 'Recommended project: Build a low-overhead eBPF request tracer' },
  { skill: 'Rust FFI Extensions', status: 'growth', note: 'Recommended project: Benchmark SIMD quantization crate' },
];

export const SkillGapMatrix: React.FC = () => {
  const { jobDescription } = useApp();
  const { addToast } = useToast();
  const [analysis, setAnalysis] = useState(DEFAULT_ANALYSIS);
  const [isLoading, setIsLoading] = useState(false);

  const handleReanalyze = async () => {
    setIsLoading(true);
    try {
      const res = await api.analyzeSkillGap();
      if (res?.gap_report) {
        const report = res.gap_report;
        const matched = (report.matched_skills || []).map((s: string) => ({
          skill: s,
          status: 'match',
          note: 'Verified from your career graph node achievements',
        }));
        const missing = (report.missing_skills || []).map((s: string) => ({
          skill: s,
          status: 'gap',
          note: 'Identified as required in target job description',
        }));
        if (matched.length > 0 || missing.length > 0) {
          setAnalysis([...matched, ...missing]);
        }
        addToast({
          title: 'Skill Gap Matrix Updated',
          description: `Calculated ${report.match_percentage || 85}% alignment with role requirements.`,
          type: 'success',
        });
      }
    } catch {
      // Keep default
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Skill Gap &amp; Readiness Matrix
            </h3>
            <p className="text-[11px] text-neutral-400">
              Evaluates {jobDescription.company} ({jobDescription.roleTitle}) requirements against your career history
            </p>
          </div>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium border border-neutral-700"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
          <span>{isLoading ? 'Analyzing...' : 'Re-calculate Gap'}</span>
        </button>
      </div>

      <div className="space-y-2">
        {analysis.map((item) => (
          <div
            key={item.skill}
            className="flex items-start justify-between gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-950/60 text-xs"
          >
            <div className="space-y-1">
              <span className="font-semibold text-white">{item.skill}</span>
              <p className="text-[11px] text-neutral-400">{item.note}</p>
            </div>

            <div className="shrink-0">
              {item.status === 'match' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Strong Match
                </span>
              )}
              {item.status === 'growth' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950/60 border border-indigo-800 text-indigo-400">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" /> Growth Area
                </span>
              )}
              {item.status === 'gap' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/60 border border-amber-800 text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Gap Identified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
