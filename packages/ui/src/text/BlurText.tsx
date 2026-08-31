'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../utils/cn';

export interface BlurTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  delay?: number; // base delay in ms
  stepDelay?: number; // delay per word in ms
  initialBlur?: number; // blur in px
  duration?: number; // animation duration in seconds
  className?: string;
  splitBy?: 'words' | 'characters';
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 100,
  stepDelay = 60,
  initialBlur = 12,
  duration = 0.8,
  className,
  splitBy = 'words',
  ...props
}) => {
  const [mounted, setMounted] = useState(false);
  const elements = splitBy === 'words' ? text.split(' ') : text.split('');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span className={cn('inline-flex flex-wrap gap-x-1.5 leading-relaxed', className)} {...props}>
      {elements.map((el, i) => (
        <span
          key={i}
          className="inline-block transition-all ease-out"
          style={{
            filter: mounted ? 'blur(0px)' : `blur(${initialBlur}px)`,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(8px)',
            transitionDuration: `${duration}s`,
            transitionDelay: `${(i * stepDelay) / 1000}s`,
          }}
        >
          {el === ' ' ? '\u00A0' : el}
        </span>
      ))}
    </span>
  );
};
