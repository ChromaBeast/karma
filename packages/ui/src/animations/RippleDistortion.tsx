'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '../utils/cn';

export interface RippleDistortionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  maxRipples?: number;
  rippleColor?: string;
  className?: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export const RippleDistortion: React.FC<RippleDistortionProps> = ({
  children,
  maxRipples = 6,
  rippleColor = 'rgba(99, 102, 241, 0.4)',
  className,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ripples = useRef<Ripple[]>([]);

  const addRipple = useCallback((x: number, y: number) => {
    if (ripples.current.length >= maxRipples) {
      ripples.current.shift();
    }
    ripples.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 180,
      opacity: 0.8,
    });
  }, [maxRipples]);

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    addRipple(e.clientX - rect.left, e.clientY - rect.top);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripples.current.forEach((r) => {
        r.radius += 2.5;
        r.opacity *= 0.96;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = rippleColor;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = r.opacity;
        ctx.stroke();
      });

      ripples.current = ripples.current.filter((r) => r.opacity > 0.02);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [rippleColor]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handlePointerDown}
      className={cn('relative overflow-hidden cursor-pointer select-none', className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />
      <div className="relative z-0">{children}</div>
    </div>
  );
};
