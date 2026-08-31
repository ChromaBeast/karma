'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '../utils/cn';
import { lerp } from '../utils/math';

export interface GlowCursorProps {
  color?: string;
  size?: number;
  blur?: number;
  opacity?: number;
  className?: string;
}

export const GlowCursor: React.FC<GlowCursorProps> = ({
  color = 'rgba(99, 102, 241, 0.15)',
  size = 400,
  blur = 60,
  opacity = 0.8,
  className,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    const updatePosition = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.12);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.12);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x - size / 2}px, ${
          currentPos.current.y - size / 2
        }px, 0)`;
      }

      animationId = requestAnimationFrame(updatePosition);
    };

    animationId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [size]);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={cn('fixed top-0 left-0 pointer-events-none z-40 will-change-transform', className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  );
};
