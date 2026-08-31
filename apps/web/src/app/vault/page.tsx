'use client';

import React, { useState } from 'react';
import { KeyRound, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KeyCard } from '../../components/vault/KeyCard';
import { KeyInputModal } from '../../components/vault/KeyInputModal';
import { SecurityBadge } from '../../components/vault/SecurityBadge';
import { AuditLogTable } from '../../components/vault/AuditLogTable';
import { VaultKey } from '../../lib/types';
import { DecryptedText, SpotlightCard } from '@karma/ui';

const SUPPORTED_PROVIDERS: Array<{ provider: VaultKey['provider']; name: string; model: string; color: string }> = [
  { provider: 'anthropic', name: 'Anthropic Claude', model: 'claude-3-5-sonnet-20241022', color: 'text-amber-400' },
  { provider: 'openai', name: 'OpenAI GPT-4o', model: 'gpt-4o', color: 'text-emerald-400' },
  { provider: 'gemini', name: 'Google Gemini Pro', model: 'gemini-1.5-pro', color: 'text-blue-400' },
];

export default function VaultPage() {
  const { vaultKeys } = useApp();
  const [selectedKey, setSelectedKey] = useState<VaultKey | null>(null);

  const getVaultKey = (provider: VaultKey['provider']): VaultKey | undefined => {
    return vaultKeys.find((k) => k.provider === provider);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              BYOK Security Vault
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <DecryptedText text="AES-256-GCM Envelope" speed={25} />
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Store and route your own LLM provider keys with hardware-backed root envelope encryption.
          </p>
        </div>
      </div>

      <SecurityBadge />

      {/* Key Providers Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-semibold uppercase tracking-wider">
          <span>Supported Key Providers</span>
          <span className="font-mono text-[10px] text-neutral-500">
            {vaultKeys.filter((k) => k.isActive).length} / {SUPPORTED_PROVIDERS.length} Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUPPORTED_PROVIDERS.map((p) => {
            const existing = getVaultKey(p.provider);
            if (existing) {
              return <KeyCard key={existing.id} vaultKey={existing} onEdit={setSelectedKey} />;
            }
            return (
              <SpotlightCard key={p.provider} className="p-5 space-y-4 border-dashed border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                    <KeyRound className={`w-5 h-5 ${p.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{p.name}</h4>
                    <span className="text-[11px] font-mono text-neutral-500">{p.model}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-900 text-xs text-neutral-400 text-center">
                  No API key configured
                </div>

                <button
                  onClick={() =>
                    setSelectedKey({
                      id: '',
                      provider: p.provider,
                      keyLast4: '',
                      isActive: true,
                      model: p.model,
                    })
                  }
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Configure {p.name.split(' ')[0]} Key</span>
                </button>
              </SpotlightCard>
            );
          })}
        </div>
      </div>

      <AuditLogTable />

      {selectedKey && (
        <KeyInputModal vaultKey={selectedKey} onClose={() => setSelectedKey(null)} />
      )}
    </div>
  );
}
