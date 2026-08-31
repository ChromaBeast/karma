'use client';

import React, { useRef, useEffect } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const MockupCanvas: React.FC = () => {
  const { mockup } = useApp();
  const { addToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

    // 1. Draw Gradient Background
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

    // 2. Draw Frame Box with Shadow
    const frameW = width * 0.75;
    const frameH = height * 0.65;
    const frameX = (width - frameW) / 2;
    const frameY = (height - frameH) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = mockup.shadowIntensity;
    ctx.shadowOffsetY = 20;

    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(frameX, frameY, frameW, frameH, 14);
    ctx.fill();
    ctx.restore();

    // 3. Draw Header Bar (Browser dots or Notch)
    if (mockup.frameType === 'browser' || mockup.frameType === 'macbook') {
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.roundRect(frameX, frameY, frameW, 28, [14, 14, 0, 0]);
      ctx.fill();

      // Window dots (red, yellow, green)
      const dotColors = ['#ef4444', '#f59e0b', '#10b981'];
      dotColors.forEach((color, i) => {
        ctx.beginPath();
        ctx.arc(frameX + 16 + i * 14, frameY + 14, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Browser URL pill
      if (mockup.frameType === 'browser') {
        ctx.fillStyle = '#09090b';
        ctx.beginPath();
        ctx.roundRect(frameX + 70, frameY + 6, frameW - 140, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#71717a';
        ctx.font = '9px monospace';
        ctx.fillText('https://karma.app/proof/alex-systems', frameX + 80, frameY + 18);
      }
    }

    // 4. Load & Draw Screenshot Image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = mockup.sourceImageUrl;
    img.onload = () => {
      const contentY = mockup.frameType === 'iphone' ? frameY : frameY + 28;
      const contentH = mockup.frameType === 'iphone' ? frameH : frameH - 28;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(frameX, contentY, frameW, contentH, [0, 0, 14, 14]);
      ctx.clip();
      ctx.drawImage(img, frameX, contentY, frameW, contentH);

      // Glare overlay
      if (mockup.glareEffect) {
        const glareGrad = ctx.createLinearGradient(frameX, contentY, frameX + frameW, contentY + contentH);
        glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        glareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
        glareGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
        ctx.fillStyle = glareGrad;
        ctx.fillRect(frameX, contentY, frameW, contentH);
      }
      ctx.restore();
    };
  }, [mockup]);

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `karma-proof-mockup-${mockup.frameType}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    addToast({
      title: 'Exported High-Res PNG',
      description: 'Saved visual proof artifact to your downloads.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Live Proof Render Canvas
          </h3>
        </div>
        <button
          onClick={handleExportPNG}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export 2x PNG</span>
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 flex items-center justify-center overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto rounded-xl shadow-lg border border-neutral-800/80"
        />
      </div>
    </div>
  );
};
