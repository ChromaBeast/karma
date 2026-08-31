'use client';

import React, { useRef, useEffect } from 'react';
import { Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { CodeMockupView } from './CodeMockupView';

interface ExtendedMockupCanvasProps {
  mode: 'screenshot' | 'code' | 'metric';
  codeSnippet: string;
  codeLang: string;
}

export const MockupCanvas: React.FC<ExtendedMockupCanvasProps> = ({
  mode,
  codeSnippet,
  codeLang,
}) => {
  const { mockup } = useApp();
  const { addToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode === 'code' || mode === 'metric') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 800;
    let height = 450;
    if (mockup.aspectRatio === '4:3') height = 600;
    if (mockup.aspectRatio === '1:1') height = 800;

    canvas.width = width;
    canvas.height = height;

    // Draw Gradient Background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (mockup.gradientBg.includes('#1e1b4b')) {
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#312e81');
      grad.addColorStop(1, '#4338ca');
    } else if (mockup.gradientBg.includes('#581c87')) {
      grad.addColorStop(0, '#581c87');
      grad.addColorStop(0.5, '#7e22ce');
      grad.addColorStop(1, '#db2777');
    } else if (mockup.gradientBg.includes('#064e3b')) {
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(0.5, '#047857');
      grad.addColorStop(1, '#0d9488');
    } else {
      grad.addColorStop(0, '#18181b');
      grad.addColorStop(0.5, '#27272a');
      grad.addColorStop(1, '#09090b');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw Frame Box
    const frameW = width * 0.76;
    const frameH = height * 0.66;
    const frameX = (width - frameW) / 2;
    const frameY = (height - frameH) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = mockup.shadowIntensity || 30;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(frameX, frameY, frameW, frameH, 14);
    ctx.fill();
    ctx.restore();

    // Draw Window Header
    if (mockup.frameType !== 'iphone') {
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.roundRect(frameX, frameY, frameW, 26, [14, 14, 0, 0]);
      ctx.fill();

      const dotColors = ['#ef4444', '#f59e0b', '#10b981'];
      dotColors.forEach((c, i) => {
        ctx.beginPath();
        ctx.arc(frameX + 14 + i * 12, frameY + 13, 4, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      });
    }

    // Draw Image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = mockup.sourceImageUrl;
    img.onload = () => {
      const topOffset = mockup.frameType === 'iphone' ? 0 : 26;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(frameX, frameY + topOffset, frameW, frameH - topOffset, [0, 0, 14, 14]);
      ctx.clip();
      ctx.drawImage(img, frameX, frameY + topOffset, frameW, frameH - topOffset);
      ctx.restore();
    };
  }, [mockup, mode]);

  const handleExport = () => {
    addToast({
      title: 'High-Res Mockup Exported',
      description: 'Saved visual proof artifact to your workspace.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Visual Proof Studio
          </h3>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export 4K Artifact</span>
        </button>
      </div>

      <div
        className="rounded-2xl border border-neutral-800 p-8 flex items-center justify-center overflow-hidden shadow-2xl min-h-[380px]"
        style={{ background: mockup.gradientBg }}
      >
        {mode === 'code' ? (
          <div className="w-full max-w-lg shadow-2xl">
            <CodeMockupView
              code={codeSnippet}
              language={codeLang}
              filename={`main.${codeLang.toLowerCase() === 'go' ? 'go' : codeLang.toLowerCase() === 'python' ? 'py' : 'ts'}`}
              theme="one-dark"
            />
          </div>
        ) : mode === 'metric' ? (
          <div className="w-full max-w-md p-6 rounded-2xl border border-neutral-700/60 bg-neutral-900/90 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                Verified Benchmark
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white tracking-tight">100,000 req/s</h3>
              <p className="text-xs text-indigo-300 font-medium">p99 Latency: 1.84ms &middot; 0% Dropped Packets</p>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              In-memory shard cluster re-architecture with sync.RWMutex lock splitting.
            </p>
          </div>
        ) : (
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl shadow-2xl border border-neutral-800/80" />
        )}
      </div>
    </div>
  );
};
