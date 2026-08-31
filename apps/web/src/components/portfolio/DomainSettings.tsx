'use client';

import React, { useState } from 'react';
import { Globe, CheckCircle2, RefreshCw, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

export const DomainSettings: React.FC = () => {
  const { portfolio, setPortfolio } = useApp();
  const { addToast } = useToast();
  const [subdomainInput, setSubdomainInput] = useState(portfolio.subdomain || '');
  const [customDomainInput, setCustomDomainInput] = useState(portfolio.customDomain || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    if (!subdomainInput.trim()) {
      addToast({
        title: 'Invalid Subdomain',
        description: 'Subdomain cannot be empty.',
        type: 'error',
      });
      return;
    }

    setIsSaving(true);
    try {
      const cleanSub = subdomainInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      await api.upsertPortfolio(portfolio.themeId, cleanSub, {
        custom_domain: customDomainInput.trim() || undefined,
      });

      setPortfolio((prev) => ({
        ...prev,
        subdomain: cleanSub,
        customDomain: customDomainInput.trim() || undefined,
        domainVerified: !!customDomainInput.trim(),
      }));

      addToast({
        title: 'Domain Settings Saved',
        description: `Your portfolio is configured at ${cleanSub}.karma.app`,
        type: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save domain settings.';
      addToast({
        title: 'Save Failed',
        description: msg,
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Domain &amp; Routing
          </h3>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
        >
          {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Settings</span>
        </button>
      </div>

      {/* Karma Subdomain */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-neutral-300">
          Karma Subdomain
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center px-3.5 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white font-mono focus-within:border-indigo-500">
            <input
              type="text"
              value={subdomainInput}
              onChange={(e) => setSubdomainInput(e.target.value)}
              placeholder="your-subdomain"
              className="bg-transparent border-none outline-none flex-1 text-white placeholder-neutral-500"
            />
            <span className="text-neutral-500">.karma.app</span>
          </div>
          {portfolio.subdomain && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-2 rounded-xl border border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>
      </div>

      {/* Custom Domain Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-neutral-300">
          Custom Domain (Optional)
        </label>
        <input
          type="text"
          value={customDomainInput}
          onChange={(e) => setCustomDomainInput(e.target.value)}
          placeholder="e.g. alex.dev or portfolio.mydomain.com"
          className="w-full px-3.5 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white font-mono placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
        />
        <p className="text-[10px] text-neutral-500">
          Point a CNAME record to <code className="text-indigo-400 font-mono">cname.karma.app</code> with TTL 300.
        </p>
      </div>
    </div>
  );
};
