'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyCard } from '../../components/vault/KeyCard';
import { KeyInputModal } from '../../components/vault/KeyInputModal';
import { SecurityBadge } from '../../components/vault/SecurityBadge';
import { AuditLogTable } from '../../components/vault/AuditLogTable';
import { VaultKey } from '../../lib/types';
import { DecryptedText } from '@karma/ui';

export default function VaultPage() {
  const { vaultKeys } = useApp();
  const [selectedKey, setSelectedKey] = useState<VaultKey | null>(null);

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

      {/* Security Allowance Callout */}
      <SecurityBadge />

      {/* Key Providers Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-semibold uppercase tracking-wider">
          <span>Configured Key Providers</span>
          <span className="font-mono text-[10px] text-neutral-500">
            {vaultKeys.filter((k) => k.isActive).length} / {vaultKeys.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vaultKeys.map((k) => (
            <KeyCard key={k.id} vaultKey={k} onEdit={setSelectedKey} />
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <AuditLogTable />

      {selectedKey && (
        <KeyInputModal vaultKey={selectedKey} onClose={() => setSelectedKey(null)} />
      )}
    </div>
  );
}
