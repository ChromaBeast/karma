'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface HyperspeedProps extends React.HTMLAttributes<HTMLCanvasElement> {
  starCount?: number;
  speed?: number;
  starColor?: string;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
}

export const Hyperspeed: React.FC<HyperspeedProps> = ({
  starCount = 150,
  speed = 12,
  starColor = '#ffffff',
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
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      pz: width,
    }));

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.4)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        star.pz = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.z = width;
          star.pz = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 250 / star.z;
        const pk = 250 / star.pz;

        const sx = star.x * k + cx;
        const sy = star.y * k + cy;
        const px = star.x * pk + cx;
        const py = star.y * pk + cy;

        const size = Math.max(0.5, (1 - star.z / width) * 2.5);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = starColor;
        ctx.lineWidth = size;
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [starCount, speed, starColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 w-full h-full', className)}
      {...props}
    />
  );
};
