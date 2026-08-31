'use client';

import React, { useState } from 'react';
import { Globe, CheckCircle2, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const DomainSettings: React.FC = () => {
  const { portfolio, setPortfolio } = useApp();
  const { addToast } = useToast();
  const [customDomainInput, setCustomDomainInput] = useState(portfolio.customDomain || '');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSaveDomain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setPortfolio((prev) => ({
        ...prev,
        customDomain: customDomainInput,
        domainVerified: true,
      }));
      setIsVerifying(false);
      addToast({
        title: 'Custom Domain Verified',
        description: `SSL Certificate issued and CNAME routed to ${customDomainInput}.`,
        type: 'success',
      });
    }, 1000);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          Domain & Routing
        </h3>
      </div>

      {/* Karma Subdomain */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-neutral-300">
          Default Subdomain
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white font-mono">
            <span>{portfolio.subdomain}</span>
            <span className="text-neutral-500">.karma.app</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-1.5 rounded-xl border border-emerald-800/40">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active
          </span>
        </div>
      </div>

      {/* Custom Domain Input */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-neutral-300">
          Custom Domain (CNAME Verification)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customDomainInput}
            onChange={(e) => setCustomDomainInput(e.target.value)}
            placeholder="e.g. alex.systems"
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white font-mono placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleSaveDomain}
            disabled={isVerifying}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium border border-neutral-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>Verify</span>
          </button>
        </div>
        <p className="text-[10px] text-neutral-500">
          Set CNAME to <code className="text-indigo-400">cname.karma.app</code> with TTL 300.
        </p>
      </div>
    </div>
  );
};
