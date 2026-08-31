'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface WavesProps extends React.HTMLAttributes<HTMLCanvasElement> {
  waveCount?: number;
  waveColor?: string;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  className?: string;
}

export const Waves: React.FC<WavesProps> = ({
  waveCount = 3,
  waveColor = 'rgba(99, 102, 241, 0.12)',
  speed = 0.015,
  amplitude = 35,
  frequency = 0.008,
  className,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += speed;

      const baseHeight = canvas.height * 0.65;

      for (let i = 0; i < waveCount; i++) {
        const offset = (i * Math.PI) / 3;
        const currentAmp = amplitude * (1 - i * 0.2);

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 10) {
          const y =
            baseHeight +
            Math.sin(x * frequency + step + offset) * currentAmp +
            Math.cos(x * frequency * 0.5 + step * 0.8) * (currentAmp * 0.5);

          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        ctx.fillStyle = waveColor;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [waveCount, waveColor, speed, amplitude, frequency]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 w-full h-full', className)}
      {...props}
    />
  );
};
