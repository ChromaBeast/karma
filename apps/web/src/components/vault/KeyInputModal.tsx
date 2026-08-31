'use client';

import React, { useState } from 'react';
import { X, KeyRound, ShieldCheck, Lock } from 'lucide-react';
import { VaultKey } from '../../lib/types';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

interface KeyInputModalProps {
  vaultKey: VaultKey | null;
  onClose: () => void;
}

export const KeyInputModal: React.FC<KeyInputModalProps> = ({ vaultKey, onClose }) => {
  const { saveVaultKey } = useApp();
  const { addToast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isSealing, setIsSealing] = useState(false);

  if (!vaultKey) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSealing(true);
    setTimeout(() => {
      saveVaultKey(vaultKey.provider, apiKey.trim());
      setIsSealing(false);
      addToast({
        title: 'API Key Sealed in Envelope Vault',
        description: `Key encrypted with AES-256-GCM data key wrapped by KMS root.`,
        type: 'success',
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              Update {vaultKey.provider.toUpperCase()} API Key
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Secret API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-... or sk-..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1 text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Storage Client Ingestion</span>
            </div>
            <p className="leading-relaxed">
              Decrypted strictly inside worker memory during background LLM orchestration. Outbound client is locked to provider allowlisted base-URLs only.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-800 text-xs font-medium text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSealing || !apiKey.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSealing ? 'Encrypting & Storing...' : 'Seal Key'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
