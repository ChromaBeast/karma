'use client';

import React from 'react';
import { Printer, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const ResumePreviewA4: React.FC = () => {
  const { resume, jobDescription } = useApp();
  const { addToast } = useToast();

  const handleExport = () => {
    addToast({
      title: 'Compiling ATS PDF',
      description: 'Rendering single-column PDF with embedded font metadata...',
      type: 'success',
    });
    window.print();
  };

  const includedBullets = resume.bullets.filter((b) => b.included);

  return (
    <div className="space-y-3">
      {/* Preview Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-neutral-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Live ATS A4 Document Preview
          </h3>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium border border-neutral-700 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* A4 Document Viewport */}
      <div className="rounded-xl border border-neutral-700 bg-white text-neutral-900 p-8 shadow-2xl min-h-[600px] font-sans leading-relaxed text-[11px] selection:bg-neutral-200">
        {/* Contact Header */}
        <div className="border-b border-neutral-300 pb-4 mb-4 text-center">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
            Alex Mercer
          </h1>
          <p className="text-xs text-neutral-600 font-medium mt-0.5">
            San Francisco, CA • alex@mercer.dev • linkedin.com/in/alexmercer • github.com/alexmercer
          </p>
        </div>

        {/* Section: Tailored Target Summary */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1.5">
            Target Role & Core Architecture
          </h2>
          <p className="text-neutral-700 text-[11px] leading-normal">
            Specialized in {jobDescription.roleTitle} with 8+ years designing high-throughput distributed systems, vector retrieval pipelines, and low-latency cloud infrastructure.
          </p>
        </div>

        {/* Section: Experience & Selected Bullets */}
        <div className="mb-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1.5">
            Key Experience & Impact
          </h2>

          <div className="space-y-1">
            <div className="flex justify-between items-baseline font-bold text-neutral-900">
              <span>Staff Distributed Systems Engineer</span>
              <span className="text-[10px] font-normal text-neutral-600">2022 — Present</span>
            </div>
            <div className="text-[10px] text-neutral-600 font-semibold mb-1">
              Cloud Infrastructure Platform • San Francisco, CA
            </div>

            <ul className="list-disc list-outside pl-4 space-y-1.5 text-neutral-800 text-[10.5px]">
              {includedBullets.map((b, idx) => (
                <li key={idx} className="leading-snug">
                  {b.finalText}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section: Technical Skills */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1.5">
            Technical Core & Languages
          </h2>
          <p className="text-neutral-700 text-[10.5px]">
            <strong className="font-semibold text-neutral-900">Languages & Runtimes: </strong>
            Go (Golang), Rust, TypeScript, Python, C++, SQL.
          </p>
          <p className="text-neutral-700 text-[10.5px] mt-0.5">
            <strong className="font-semibold text-neutral-900">Distributed & Cloud: </strong>
            Kubernetes, PostgreSQL (pgvector), Redis, Kafka, AWS, Docker, Envoy.
          </p>
        </div>

        {/* Section: Education */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="flex justify-between items-baseline text-neutral-800 text-[10.5px]">
            <span>B.S. in Computer Science — University of California, Berkeley</span>
            <span className="text-[10px] text-neutral-600">Graduated Magna Cum Laude</span>
          </div>
        </div>
      </div>
    </div>
  );
};
