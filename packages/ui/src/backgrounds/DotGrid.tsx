'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface DotGridProps extends React.HTMLAttributes<HTMLCanvasElement> {
  gridSpacing?: number;
  dotRadius?: number;
  dotColor?: string;
  activeColor?: string;
  proximity?: number;
  className?: string;
}

export const DotGrid: React.FC<DotGridProps> = ({
  gridSpacing = 24,
  dotRadius = 1.5,
  dotColor = 'rgba(255, 255, 255, 0.1)',
  activeColor = 'rgba(99, 102, 241, 0.8)',
  proximity = 100,
  className,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouse.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let x = gridSpacing / 2; x < width; x += gridSpacing) {
        for (let y = gridSpacing / 2; y < height; y += gridSpacing) {
          let radius = dotRadius;
          let color = dotColor;

          if (mouse.current.x !== null && mouse.current.y !== null) {
            const dist = Math.hypot(mouse.current.x - x, mouse.current.y - y);
            if (dist < proximity) {
              const factor = 1 - dist / proximity;
              radius = dotRadius + factor * 2;
              color = activeColor;
            }
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [gridSpacing, dotRadius, dotColor, activeColor, proximity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 w-full h-full', className)}
      {...props}
    />
  );
};
