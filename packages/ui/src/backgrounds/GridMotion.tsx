'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface GridMotionProps extends React.HTMLAttributes<HTMLCanvasElement> {
  gridSize?: number;
  speed?: number;
  lineColor?: string;
  className?: string;
}

export const GridMotion: React.FC<GridMotionProps> = ({
  gridSize = 40,
  speed = 0.5,
  lineColor = 'rgba(99, 102, 241, 0.15)',
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
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      offset = (offset + speed) % gridSize;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      // Vertical moving lines
      for (let x = offset; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal moving lines
      for (let y = offset; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [gridSize, speed, lineColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 w-full h-full', className)}
      {...props}
    />
  );
};
