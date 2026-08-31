'use client';

import React from 'react';
import { Target, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SkillGapMatrix: React.FC = () => {
  const { jobDescription } = useApp();

  const SKILLS_ANALYSIS = [
    { skill: 'Go (Golang) / Concurrency', status: 'match', nodeEvidence: 'Staff Systems Architect (Stripe) - 400k rps proxy' },
    { skill: 'Kubernetes & Multi-AZ Egress', status: 'match', nodeEvidence: '12 Availability Zones routing deployment' },
    { skill: 'PostgreSQL & pgvector', status: 'match', nodeEvidence: 'HNSW indexing sub-5ms across 10M embeddings' },
    { skill: 'eBPF / Kernel Tracing', status: 'gap', recommendation: 'Recommended project: Build an eBPF packet filter tracer' },
    { skill: 'Rust FFI Extensions', status: 'growth', recommendation: 'Strengthen by publishing SIMD quantization crate benchmarks' },
  ];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Skill Gap & Readiness Matrix
            </h3>
            <p className="text-[11px] text-neutral-400">
              Evaluates {jobDescription.company} ({jobDescription.roleTitle}) requirements against verified graph nodes
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {SKILLS_ANALYSIS.map((item) => (
          <div
            key={item.skill}
            className="flex items-start justify-between gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-950/60 text-xs"
          >
            <div className="space-y-1">
              <span className="font-semibold text-white">{item.skill}</span>
              <p className="text-[11px] text-neutral-400">
                {item.nodeEvidence || item.recommendation}
              </p>
            </div>

            <div className="shrink-0">
              {item.status === 'match' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Strong Match
                </span>
              )}
              {item.status === 'growth' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950/60 border border-indigo-800 text-indigo-400">
                  <ArrowRight className="w-3 h-3" /> Growth Area
                </span>
              )}
              {item.status === 'gap' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/60 border border-amber-800 text-amber-400">
                  <AlertTriangle className="w-3 h-3" /> Gap Identified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
