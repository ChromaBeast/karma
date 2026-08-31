'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '../utils/cn';

export interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pixelColor?: string;
  gridDensity?: number;
  className?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  pixelColor = '#6366f1',
  gridDensity = 14,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 overflow-hidden transition-all duration-300 hover:border-indigo-500/50',
        className
      )}
      {...props}
    >
      {/* Pixel Grid Pattern Overlay on Hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.25 : 0,
          backgroundImage: `radial-gradient(${pixelColor} 1px, transparent 1px)`,
          backgroundSize: `${gridDensity}px ${gridDensity}px`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
