'use client';

import React, { useState } from 'react';
import { cn } from '../utils/cn';

export interface GlitchTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  speed?: number;
  enableGlitch?: boolean;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  enableGlitch = true,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative inline-block select-none cursor-default font-bold', className)}
      {...props}
    >
      {/* Base Text */}
      <span className="relative z-10">{text}</span>

      {/* Glitch Cyan Layer */}
      {enableGlitch && isHovered && (
        <span
          aria-hidden="true"
          className="absolute inset-0 text-cyan-400 opacity-80 pointer-events-none animate-pulse"
          style={{
            transform: 'translate(-2px, -1px)',
            clipPath: 'polygon(0 20%, 100% 20%, 100% 45%, 0 45%)',
          }}
        >
          {text}
        </span>
      )}

      {/* Glitch Red/Rose Layer */}
      {enableGlitch && isHovered && (
        <span
          aria-hidden="true"
          className="absolute inset-0 text-rose-500 opacity-80 pointer-events-none animate-pulse"
          style={{
            transform: 'translate(2px, 1px)',
            clipPath: 'polygon(0 60%, 100% 60%, 100% 85%, 0 85%)',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};
