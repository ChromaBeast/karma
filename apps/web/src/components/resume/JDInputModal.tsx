'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

interface JDInputModalProps {
  onClose: () => void;
}

export const JDInputModal: React.FC<JDInputModalProps> = ({ onClose }) => {
  const { jobDescription, setJobDescription } = useApp();
  const { addToast } = useToast();
  const [roleTitle, setRoleTitle] = useState(jobDescription.roleTitle);
  const [company, setCompany] = useState(jobDescription.company);
  const [rawText, setRawText] = useState(jobDescription.rawText);
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = (e: React.FormEvent) => {
    e.preventDefault();
    setIsParsing(true);

    setTimeout(() => {
      // Simulate LLM requirement extraction pass
      setJobDescription({
        id: `jd-${Date.now()}`,
        userId: 'user-1',
        rawText,
        company: company || 'Target Company',
        roleTitle: roleTitle || 'Lead Software Engineer',
        parsedRequirements: {
          requiredSkills: ['Go / Distributed Systems', 'Kubernetes', 'PostgreSQL', 'High Concurrency', 'Cloud Architecture'],
          senioritySignals: ['Senior / Staff Level', 'Technical Mentorship', 'System Design'],
          keywords: ['Latency Reduction', 'Throughput', 'Fault Tolerance', 'Microservices'],
          atsQuirks: ['Single Column Layout Mandatory', 'No Icons in Flow', 'Quantified STAR Metrics Preferred'],
        },
        createdAt: new Date().toISOString(),
      });
      setIsParsing(false);
      addToast({
        title: 'Job Description Parsed',
        description: 'Extracted 5 core skills, 3 seniority signals, and ATS ranking weights.',
        type: 'success',
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Ingest Job Description</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleParse} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. OpenAI, Stripe, Linear"
                className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Role Title</label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Staff Infrastructure Engineer"
                className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Job Description Text / Responsibilities</label>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste the full job posting requirements and responsibilities here..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-800 text-xs font-medium text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isParsing || !rawText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium shadow-md shadow-indigo-600/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isParsing ? 'Extracting Signals...' : 'Extract & Rank'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
