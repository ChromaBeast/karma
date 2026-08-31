'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

interface Variant {
  type: string;
  headline: string;
  post: string;
}

export const LinkedInOptimizer: React.FC = () => {
  const { jobDescription } = useApp();
  const { addToast } = useToast();
  const [roleTitle, setRoleTitle] = useState(jobDescription.roleTitle || 'Senior Software Engineer');
  const [skills, setSkills] = useState(
    jobDescription.parsedRequirements.requiredSkills.join(', ') || 'Go, PostgreSQL, Cloud Architecture'
  );
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const [hlRes, postRes] = await Promise.all([
        api.generateHeadline(roleTitle, skills).catch(() => null),
        api.generatePost(roleTitle, `Key engineering focus: ${skills}`).catch(() => null),
      ]);

      const headline = hlRes?.headline || `${roleTitle} | ${skills}`;
      const postText = postRes?.post_text || `🚀 Building high-scale solutions as a ${roleTitle}.\n\nFocus areas:\n• Scaling ${skills}\n• System reliability and low-latency delivery\n• Measurable performance optimization\n\nWhat are your go-to patterns when tackling complex backend scaling?`;

      setVariants([
        {
          type: 'Technical & Metrics Focus',
          headline,
          post: postText,
        },
      ]);
      addToast({
        title: 'LinkedIn Content Generated',
        description: `Created headline and post drafts tailored to ${roleTitle}.`,
        type: 'success',
      });
    } catch {
      addToast({
        title: 'Generation Failed',
        description: 'Check your API key vault and try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    addToast({
      title: 'Copied to Clipboard',
      description: 'Ready to paste into LinkedIn.',
      type: 'success',
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              LinkedIn Content Generator
            </h3>
            <p className="text-[11px] text-neutral-400">
              Draft headlines and posts tailored to your real engineering background
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium shadow-md shadow-indigo-600/20"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{isLoading ? 'Generating...' : 'Generate Live'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Target Role</label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Core Skills</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white"
          />
        </div>
      </div>

      {variants.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-neutral-800 bg-neutral-950/40 text-neutral-500 text-xs space-y-1">
          <p className="font-semibold text-neutral-400">No content generated yet</p>
          <p>Click &quot;Generate Live&quot; to draft posts and headlines based on your role and skills.</p>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {variants.map((v, i) => (
            <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                  {v.type}
                </span>
                <button
                  onClick={() => handleCopy(v.post, i)}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
                >
                  {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === i ? 'Copied' : 'Copy Post'}</span>
                </button>
              </div>
              <div className="text-xs font-semibold text-neutral-200">
                Headline: <span className="text-neutral-400 font-normal">{v.headline}</span>
              </div>
              <pre className="text-xs text-neutral-300 whitespace-pre-wrap font-sans bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/60 leading-relaxed">
                {v.post}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
