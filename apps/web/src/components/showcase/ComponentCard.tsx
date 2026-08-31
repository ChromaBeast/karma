'use client';

import React, { useState } from 'react';
import { Copy, Check, Eye, Code } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ComponentCardProps {
  name: string;
  category: string;
  description: string;
  codeSnippet: string;
  preview: React.ReactNode;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  name,
  category,
  description,
  codeSnippet,
  preview,
}) => {
  const { addToast } = useToast();
  const [viewCode, setViewCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    addToast({
      title: 'Code Copied',
      description: `Copied <${name} /> JSX to clipboard.`,
      type: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden flex flex-col justify-between transition-all hover:border-neutral-700 shadow-lg">
      {/* Top Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white tracking-tight">{name}</h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800/40">
              {category}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">{description}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewCode(!viewCode)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              viewCode
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'border-neutral-800 text-neutral-400 hover:text-white bg-neutral-950'
            }`}
            title="Toggle Code View"
          >
            {viewCode ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white transition-colors"
            title="Copy JSX"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Live Stage / Code Preview */}
      <div className="p-6 min-h-[160px] flex items-center justify-center bg-neutral-950/80 relative overflow-hidden">
        {viewCode ? (
          <pre className="w-full text-[11px] font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed select-all">
            {codeSnippet}
          </pre>
        ) : (
          <div className="w-full flex items-center justify-center">{preview}</div>
        )}
      </div>
    </div>
  );
};
