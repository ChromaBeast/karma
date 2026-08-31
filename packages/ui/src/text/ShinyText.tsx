'use client';

import React from 'react';
import { cn } from '../utils/cn';

export interface ShinyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  disabled?: boolean;
  speed?: number; // duration in seconds
  className?: string;
  shimmerWidth?: number; // width in percent
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 3,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent transition-all',
        disabled
          ? 'text-neutral-400'
          : 'animate-shimmer bg-[linear-gradient(110deg,#a1a1aa,45%,#ffffff,55%,#a1a1aa)] bg-[length:200%_100%]',
        className
      )}
      style={{
        animationDuration: `${speed}s`,
        backgroundSize: `${shimmerWidth * 2}% 100%`,
      }}
      {...props}
    >
      {text}
    </span>
  );
};
