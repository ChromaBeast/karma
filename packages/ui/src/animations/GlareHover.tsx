'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '../utils/cn';

export interface GlareHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  className?: string;
}

export const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  glareColor = 'rgba(255, 255, 255, 0.25)',
  glareOpacity = 0.6,
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glareState, setGlareState] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setGlareState({ x, y, opacity: 1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setGlareState((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative overflow-hidden rounded-2xl group isolate', className)}
      {...props}
    >
      {/* Glare Gradient Layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
        style={{
          opacity: glareState.opacity * glareOpacity,
          background: `radial-gradient(circle at ${glareState.x}% ${glareState.y}%, ${glareColor} 0%, transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
};
