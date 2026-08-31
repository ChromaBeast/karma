'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface BallpitProps extends React.HTMLAttributes<HTMLCanvasElement> {
  ballCount?: number;
  colors?: string[];
  gravity?: number;
  friction?: number;
  className?: string;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const DEFAULT_BALL_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981'];

export const Ballpit: React.FC<BallpitProps> = ({
  ballCount = 30,
  colors = DEFAULT_BALL_COLORS,
  gravity = 0.2,
  friction = 0.98,
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

    const balls: Ball[] = Array.from({ length: ballCount }, () => ({
      x: Math.random() * (width - 40) + 20,
      y: Math.random() * (height / 2),
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 2,
      radius: Math.random() * 12 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      balls.forEach((ball) => {
        ball.vy += gravity;
        ball.vx *= friction;
        ball.vy *= friction;

        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall collisions
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx *= -0.7;
        } else if (ball.x + ball.radius > width) {
          ball.x = width - ball.radius;
          ball.vx *= -0.7;
        }

        // Floor collision
        if (ball.y + ball.radius > height) {
          ball.y = height - ball.radius;
          ball.vy *= -0.7;
        }

        // Mouse interaction
        if (mouse.current.x !== null && mouse.current.y !== null) {
          const dist = Math.hypot(ball.x - mouse.current.x, ball.y - mouse.current.y);
          if (dist < 80) {
            const angle = Math.atan2(ball.y - mouse.current.y, ball.x - mouse.current.x);
            ball.vx += Math.cos(angle) * 1.5;
            ball.vy += Math.sin(angle) * 1.5;
          }
        }

        // Draw Ball with gradient shine
        ctx.save();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.shadowColor = ball.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [ballCount, colors, gravity, friction]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 w-full h-full', className)}
      {...props}
    />
  );
};
