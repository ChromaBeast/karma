'use client';

import React from 'react';
import { cn } from '../utils/cn';

export interface StarBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color?: string;
  speed?: number; // seconds for complete loop
  borderRadius?: string;
  className?: string;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  children,
  color = '#6366f1',
  speed = 4,
  borderRadius = '0.75rem',
  className,
  ...props
}) => {
  return (
    <div
      className={cn('relative p-[1px] overflow-hidden group', className)}
      style={{ borderRadius }}
      {...props}
    >
      {/* Animated rotating gradient beam */}
      <div
        aria-hidden="true"
        className="absolute -inset-[100%] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${color} 60deg, transparent 120deg)`,
          animation: `spin ${speed}s linear infinite`,
        }}
      />

      {/* Inner Content Container */}
      <div
        className="relative z-10 w-full h-full bg-neutral-950/90 backdrop-blur-md rounded-[inherit]"
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        {children}
      </div>
    </div>
  );
};
