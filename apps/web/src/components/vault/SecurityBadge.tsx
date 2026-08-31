'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const ALLOWLISTED_URLS = [
  { domain: 'api.anthropic.com', provider: 'Anthropic' },
  { domain: 'api.openai.com', provider: 'OpenAI' },
  { domain: 'generativelanguage.googleapis.com', provider: 'Google Gemini' },
];

export const SecurityBadge: React.FC = () => {
  return (
    <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          BYOK Envelope Security & Egress Firewall Lock
        </h3>
      </div>

      <p className="text-xs text-neutral-300 leading-relaxed">
        Karma implements envelope encryption (AES-256-GCM) with hardware-backed root KMS keys. 
        Outbound LLM worker HTTP clients enforce a hard network-layer firewall allowlist to prevent key-harvesting proxy attacks.
      </p>

      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
          Allowlisted Base-URLs:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {ALLOWLISTED_URLS.map((u) => (
            <div
              key={u.domain}
              className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-[11px] font-mono text-neutral-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{u.domain}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
