'use client';

import React, { useState } from 'react';
import { FileText, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

export const CoverLetterGenerator: React.FC = () => {
  const { jobDescription } = useApp();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [company, setCompany] = useState(jobDescription.company || 'Target Company');
  const [roleTitle, setRoleTitle] = useState(jobDescription.roleTitle || 'Senior Software Engineer');
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Your Name');

  const [letterText, setLetterText] = useState(
    `Dear Hiring Team at ${company},\n\nI am writing to express my strong interest in the ${roleTitle} position. With experience architecting scalable backend services and high-throughput systems, I focus on building reliable, cost-efficient software.\n\nIn my recent work, I led the implementation of our core service architecture and query optimization layers, reducing p99 latency and delivering critical business features on time. I enjoy solving challenging engineering problems and collaborating closely with product teams.\n\nGiven ${company}'s focus on engineering excellence, I would love the opportunity to contribute to your team.\n\nSincerely,\n${displayName}`
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSynthesize = async () => {
    setIsLoading(true);
    try {
      const res = await api.generateCoverLetter(company, roleTitle);
      if (res?.body || res?.letter_text) {
        setLetterText(res.body || res.letter_text);
        addToast({
          title: 'Cover Letter Synthesized',
          description: `Customized for ${company} (${roleTitle}).`,
          type: 'success',
        });
      }
    } catch {
      // Keep default
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Tailored Cover Letter Generator
            </h3>
            <p className="text-[11px] text-neutral-400">
              Generates targeted cover letters from your real career achievements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSynthesize}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isLoading ? 'Synthesizing...' : 'Synthesize'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium border border-neutral-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Target Role</label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white"
          />
        </div>
      </div>

      <textarea
        rows={8}
        value={letterText}
        onChange={(e) => setLetterText(e.target.value)}
        className="w-full p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 text-xs text-neutral-200 font-sans leading-relaxed focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
};
