'use client';

import React from 'react';
import { KeyRound, ShieldCheck, Edit3, Power } from 'lucide-react';
import { VaultKey } from '../../lib/types';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { SpotlightCard } from '@karma/ui';

interface KeyCardProps {
  vaultKey: VaultKey;
  onEdit: (key: VaultKey) => void;
}

export const KeyCard: React.FC<KeyCardProps> = ({ vaultKey, onEdit }) => {
  const { toggleVaultKey } = useApp();
  const { addToast } = useToast();

  const handleToggle = () => {
    toggleVaultKey(vaultKey.id);
    addToast({
      title: vaultKey.isActive ? 'Provider Disabled' : 'Provider Activated',
      description: `${vaultKey.provider.toUpperCase()} routing updated.`,
      type: 'info',
    });
  };

  const getProviderInfo = () => {
    switch (vaultKey.provider) {
      case 'anthropic':
        return { name: 'Anthropic Claude', defaultModel: 'claude-3-5-sonnet-20241022', color: 'text-amber-400' };
      case 'openai':
        return { name: 'OpenAI GPT-4o', defaultModel: 'gpt-4o', color: 'text-emerald-400' };
      case 'gemini':
        return { name: 'Google Gemini Pro', defaultModel: 'gemini-1.5-pro', color: 'text-blue-400' };
    }
  };

  const info = getProviderInfo();

  return (
    <SpotlightCard className="p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neutral-800 border border-neutral-700/60">
            <KeyRound className={`w-5 h-5 ${info.color}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{info.name}</h4>
            <span className="text-[11px] font-mono text-neutral-400">{vaultKey.model}</span>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
            vaultKey.isActive
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
              : 'bg-neutral-800 border-neutral-700 text-neutral-400'
          }`}
        >
          <Power className="w-3 h-3" />
          <span>{vaultKey.isActive ? 'Active' : 'Disabled'}</span>
        </button>
      </div>

      {/* Masked Key Display & Security Envelope */}
      <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between text-xs font-mono">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-sans text-neutral-500 font-semibold block">
            AES-256-GCM Envelope Sealed
          </span>
          <span className="text-neutral-300">
            •••• •••• •••• <span className="text-white font-bold">{vaultKey.keyLast4}</span>
          </span>
        </div>

        <button
          onClick={() => onEdit(vaultKey)}
          className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          title="Update Key"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3 h-3" /> In-proc ephemeral decryption
        </span>
        {vaultKey.validatedAt && (
          <span>Verified: {new Date(vaultKey.validatedAt).toLocaleDateString()}</span>
        )}
      </div>
    </SpotlightCard>
  );
};
