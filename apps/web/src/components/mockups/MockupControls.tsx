'use client';

import React, { useRef } from 'react';
import { Laptop, Smartphone, Globe, Share2, Upload, Link as LinkIcon } from 'lucide-react';
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
  { label: 'Cyberpunk Purple', value: 'linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #db2777 100%)' },
  { label: 'Emerald Deep', value: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0d9488 100%)' },
  { label: 'Obsidian Minimal', value: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)' },
];

export const MockupControls: React.FC = () => {
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
      {/* Frame Selector */}
      <div>
        <label className="block text-xs font-semibold text-white mb-2 uppercase tracking-wider">
          Device Frame Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FRAMES.map((f) => {
            const Icon = f.icon;
            const isSelected = mockup.frameType === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setMockup((prev) => ({ ...prev, frameType: f.id }))}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300 shadow-sm'
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="block text-xs font-semibold text-white mb-2 uppercase tracking-wider">
          Aspect Ratio
        </label>
        <div className="flex gap-2">
          {(['16:9', '4:3', '1:1'] as MockupConfig['aspectRatio'][]).map((r) => (
            <button
              key={r}
              onClick={() => setMockup((prev) => ({ ...prev, aspectRatio: r }))}
              className={`flex-1 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all ${
                mockup.aspectRatio === r
                  ? 'border-indigo-500 bg-indigo-950/60 text-white'
                  : 'border-neutral-800 bg-neutral-950/40 text-neutral-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop Gradient */}
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
              <span className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ background: g.value }} />
              <span className="truncate">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Image Upload & URL */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-white uppercase tracking-wider">
          Screenshot Image
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-950/20 hover:bg-indigo-950/30 text-indigo-300 text-xs font-semibold transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image from Computer</span>
        </button>

        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={mockup.sourceImageUrl}
              onChange={(e) => setMockup((prev) => ({ ...prev, sourceImageUrl: e.target.value }))}
              placeholder="Or paste image URL (https://...)"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
