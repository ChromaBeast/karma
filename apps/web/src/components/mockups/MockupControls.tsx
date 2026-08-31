'use client';

import React, { useRef } from 'react';
import { Laptop, Smartphone, Globe, Share2, Upload, Code2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { MockupConfig } from '../../lib/types';

const FRAMES: { id: MockupConfig['frameType']; label: string; icon: React.ElementType }[] = [
  { id: 'macbook', label: 'MacBook Pro', icon: Laptop },
  { id: 'browser', label: 'Dark Browser', icon: Globe },
  { id: 'iphone', label: 'iPhone 15 Pro', icon: Smartphone },
  { id: 'social', label: 'Social Card', icon: Share2 },
];

const GRADIENTS = [
  { label: 'Indigo Night', value: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' },
  { label: 'Cyberpunk', value: 'linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #db2777 100%)' },
  { label: 'Emerald Deep', value: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0d9488 100%)' },
  { label: 'Obsidian Slate', value: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)' },
];

interface ExtendedMockupControlsProps {
  mode: 'screenshot' | 'code' | 'metric';
  setMode: (m: 'screenshot' | 'code' | 'metric') => void;
  codeSnippet: string;
  setCodeSnippet: (c: string) => void;
  codeLang: string;
  setCodeLang: (l: string) => void;
}

export const MockupControls: React.FC<ExtendedMockupControlsProps> = ({
  mode,
  setMode,
  codeSnippet,
  setCodeSnippet,
  codeLang,
  setCodeLang,
}) => {
  const { mockup, setMockup } = useApp();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setMockup((prev) => ({ ...prev, sourceImageUrl: result }));
        addToast({
          title: 'Screenshot Loaded',
          description: `Loaded "${file.name}" into mockup canvas.`,
          type: 'success',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
      {/* Studio Mode Selector */}
      <div>
        <label className="block text-xs font-semibold text-white mb-2 uppercase tracking-wider">
          Proof Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'screenshot', label: 'Device Frame', icon: ImageIcon },
            { id: 'code', label: 'Code Snippet', icon: Code2 },
            { id: 'metric', label: 'Metric Card', icon: Sparkles },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-sm'
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {mode === 'code' ? (
        /* Code Mode Controls */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-neutral-300">
              Source Code
            </label>
            <select
              value={codeLang}
              onChange={(e) => setCodeLang(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-neutral-800 bg-neutral-950 text-xs text-white font-mono"
            >
              <option value="Go">Go</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Rust">Rust</option>
              <option value="Python">Python</option>
              <option value="SQL">SQL</option>
            </select>
          </div>
          <textarea
            rows={7}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="Paste code snippet..."
            className="w-full p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-xs font-mono text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      ) : (
        /* Device Frame Controls */
        <>
          <div>
            <label className="block text-xs font-semibold text-white mb-2 uppercase tracking-wider">
              Frame Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FRAMES.map((f) => {
                const Icon = f.icon;
                const isSelected = mockup.frameType === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setMockup((prev) => ({ ...prev, frameType: f.id }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300 shadow-sm'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-950/20 hover:bg-indigo-950/30 text-indigo-300 text-xs font-semibold transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Custom Screenshot</span>
            </button>
          </div>
        </>
      )}

      {/* Backdrop Gradients */}
      <div>
        <label className="block text-xs font-semibold text-white mb-2 uppercase tracking-wider">
          Backdrop Gradient
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GRADIENTS.map((g) => (
            <button
              key={g.label}
              onClick={() => setMockup((prev) => ({ ...prev, gradientBg: g.value }))}
              className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] text-left transition-all ${
                mockup.gradientBg === g.value
                  ? 'border-indigo-500 text-white'
                  : 'border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" style={{ background: g.value }} />
              <span className="truncate">{g.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
