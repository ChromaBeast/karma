'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../utils/cn';

export interface RotatingTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  texts: string[];
  interval?: number; // ms per word
  transitionDuration?: number; // ms
  className?: string;
  itemClassName?: string;
}

export const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  interval = 2500,
  transitionDuration = 400,
  className,
  itemClassName,
  ...props
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!texts.length) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsTransitioning(false);
      }, transitionDuration / 2);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval, transitionDuration]);

  if (!texts.length) return null;

  return (
    <span
      className={cn('inline-flex overflow-hidden relative align-baseline h-[1.25em]', className)}
      {...props}
    >
      <span
        className={cn('inline-block transition-all transform ease-out', itemClassName)}
        style={{
          transitionDuration: `${transitionDuration / 2}ms`,
          transform: isTransitioning ? 'translateY(-120%) scale(0.95)' : 'translateY(0) scale(1)',
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        {texts[currentIndex]}
      </span>
    </span>
  );
};
