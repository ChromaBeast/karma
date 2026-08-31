'use client';

import React from 'react';
import { cn } from '../utils/cn';

export interface AuroraProps extends React.HTMLAttributes<HTMLDivElement> {
  color1?: string;
  color2?: string;
  color3?: string;
  className?: string;
}

export const Aurora: React.FC<AuroraProps> = ({
  color1 = 'rgba(99, 102, 241, 0.25)', // Indigo
  color2 = 'rgba(168, 85, 247, 0.2)', // Purple
  color3 = 'rgba(236, 72, 153, 0.15)', // Pink
  className,
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden select-none', className)}
      {...props}
    >
      <div
        className="absolute -top-[40%] -left-[20%] w-[80vw] h-[80vw] rounded-full blur-[100px] animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color1} 0%, transparent 70%)`,
          animationDuration: '8s',
        }}
      />
      <div
        className="absolute top-[10%] -right-[20%] w-[70vw] h-[70vw] rounded-full blur-[120px] animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color2} 0%, transparent 70%)`,
          animationDuration: '12s',
        }}
      />
      <div
        className="absolute -bottom-[30%] left-[20%] w-[60vw] h-[60vw] rounded-full blur-[90px] animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color3} 0%, transparent 70%)`,
          animationDuration: '10s',
        }}
      />
    </div>
  );
};
