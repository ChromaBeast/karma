'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TIERS = [
  {
    name: 'Free Community',
    price: '$0',
    frequency: 'forever',
    description: 'Essential career graph capture and standard resume generation.',
    features: ['Manual career event capture', '1 Active ATS resume', 'Standard subdomain portfolio', 'Community question banks'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Access (BYOK)',
    price: '$49',
    frequency: 'one-time fee',
    description: 'Lifetime access with your own LLM keys (Anthropic, OpenAI, Gemini).',
    features: ['BYOK Envelope Encryption Vault', 'Unlimited pgvector ATS resumes', 'Custom domain with auto-SSL', 'Mock interview simulations', 'Network base-URL lock guarantee'],
    cta: 'Get Lifetime Access',
    highlighted: true,
  },
  {
    name: 'Access + Credits',
    price: '$79',
    frequency: 'one-time + managed credits',
    description: 'All Access features plus pre-funded managed AI generation credits.',
    features: ['Everything in Access (BYOK)', '$30 Managed LLM credit balance', 'Zero API setup required', 'Priority queue event structuring', 'Automated weekly check-in nudges'],
    cta: 'Get Access + Credits',
    highlighted: false,
  },
];

export const PricingSection: React.FC = () => {
  const { openAuthModal } = useAuth();

  return (
    <div className="space-y-6 pt-4">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Sustainable, One-Time Access Model
        </h2>
        <p className="text-xs text-neutral-400">
          No recurring SaaS subscriptions. Bring your own API keys or use metered managed credits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-3xl p-6 flex flex-col justify-between space-y-6 border transition-all ${
              tier.highlighted
                ? 'border-indigo-500/60 bg-gradient-to-b from-indigo-950/40 to-neutral-900 shadow-xl shadow-indigo-950/30 ring-1 ring-indigo-500/40'
                : 'border-neutral-800 bg-neutral-900/60'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{tier.name}</h3>
                {tier.highlighted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-[10px] font-semibold text-indigo-300 border border-indigo-500/40">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Popular
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">{tier.price}</span>
                  <span className="text-xs text-neutral-400 font-medium">/{tier.frequency}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">{tier.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={openAuthModal}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all active:scale-95 ${
                tier.highlighted
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
