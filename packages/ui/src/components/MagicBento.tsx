'use client';

import React from 'react';
import { cn } from '../utils/cn';

export interface MagicBentoProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: number;
  gap?: string;
  className?: string;
}

export const MagicBento: React.FC<MagicBentoProps> = ({
  children,
  columns = 3,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-2',
        className
      )}
      style={{
        gridTemplateColumns: columns > 3 ? `repeat(${columns}, minmax(0, 1fr))` : undefined,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export interface MagicBentoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  glowColor?: string;
  className?: string;
}

export const MagicBentoItem: React.FC<MagicBentoItemProps> = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  glowColor = 'rgba(99, 102, 241, 0.2)',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:shadow-xl',
        colSpan === 2 && 'md:col-span-2',
        colSpan === 3 && 'md:col-span-3',
        rowSpan === 2 && 'row-span-2',
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at center, ${glowColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
