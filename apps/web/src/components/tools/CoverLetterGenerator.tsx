'use client';

import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const CoverLetterGenerator: React.FC = () => {
  const { jobDescription } = useApp();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const coverLetterText = `Dear Hiring Team at ${jobDescription.company},

I am writing to express my strong interest in the ${jobDescription.roleTitle} position. With over 8 years architecting distributed backend infrastructure and high-throughput microservices in Go, I have consistently focused on building scalable, cost-efficient platforms.

At Stripe / Cloud Scale, I led the redesign of our global egress proxy mesh across 12 availability zones, reducing tail p99 latency by 42% and generating $1.2M in annual cloud infrastructure cost savings. Furthermore, I engineered an open-source vector retrieval engine utilizing PostgreSQL pgvector with SIMD quantization, achieving sub-5ms similarity search over 10 million embeddings.

Given ${jobDescription.company}'s emphasis on high availability and resilient infrastructure, I am eager to bring my deep background in Go, Kubernetes, and distributed database architecture to your engineering team.

Thank you for your time and consideration.

Sincerely,
Alex Mercer`;

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetterText);
    setCopied(true);
    addToast({
      title: 'Cover Letter Copied',
      description: 'Ready to submit with your application.',
      type: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Tailored Cover Letter Synthesis
            </h3>
            <p className="text-[11px] text-neutral-400">
              Matched against {jobDescription.company} ({jobDescription.roleTitle})
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium border border-neutral-700 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Text'}</span>
        </button>
      </div>

      <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
        {coverLetterText}
      </div>
    </div>
  );
};
