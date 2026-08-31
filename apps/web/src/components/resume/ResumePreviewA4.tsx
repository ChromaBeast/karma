'use client';

import React from 'react';
import { Printer, Eye, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ResumePreviewA4: React.FC = () => {
  const { resume, jobDescription } = useApp();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleExport = () => {
    addToast({
      title: 'Compiling 1-Page PDF',
      description: 'Printing formatted single-column ATS resume...',
      type: 'success',
    });
    window.print();
  };

  const includedBullets = resume.bullets.filter((b) => b.included);
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Your Name');
  const displayEmail = user?.email || 'your.email@example.com';

  return (
    <div className="space-y-3">
      {/* Preview Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-neutral-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Live 1-Page Document Preview
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
        <div className="border-b border-neutral-300 pb-3 mb-3 text-center">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
            {displayName}
          </h1>
          <p className="text-xs text-neutral-600 font-medium mt-0.5">
            {displayEmail} • linkedin.com/in/{displayName.toLowerCase().replace(/\s+/g, '')}
          </p>
        </div>

        {/* Section: Tailored Target Summary */}
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1">
            Target Role &amp; Summary
          </h2>
          <p className="text-neutral-700 text-[10.5px] leading-normal">
            Specialized in {jobDescription.roleTitle || 'Software Engineering'} at {jobDescription.company || 'Technology Platforms'}, with verified achievements in high-scale systems, backend optimization, and reliable delivery.
          </p>
        </div>

        {/* Section: Experience & Selected Bullets */}
        <div className="mb-3 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1">
            Key Experience &amp; Impact
          </h2>

          {includedBullets.length === 0 ? (
            <div className="p-4 rounded-lg bg-neutral-50 border border-dashed border-neutral-300 text-center text-neutral-500 text-[11px] space-y-1">
              <Sparkles className="w-4 h-4 text-indigo-500 mx-auto" />
              <p className="font-semibold text-neutral-700">No bullet points selected yet.</p>
              <p>Click &quot;Target Job&quot; to paste a job posting and generate tailored achievements from your career graph.</p>
            </div>
          ) : (
            <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-[10.5px]">
              {includedBullets.map((b, idx) => (
                <li key={idx} className="leading-snug">
                  {b.finalText}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Section: Technical Skills */}
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1">
            Core Skills &amp; Technologies
          </h2>
          <p className="text-neutral-700 text-[10.5px]">
            {jobDescription.parsedRequirements.requiredSkills.join(', ') || 'Go, PostgreSQL, Distributed Systems, Microservices, Cloud'}
          </p>
        </div>
      </div>
    </div>
  );
};
