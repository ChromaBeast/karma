'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

export interface SplitTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
  splitBy?: 'characters' | 'words';
  staggerDelay?: number;
  duration?: number;
  className?: string;
  animateOnMount?: boolean;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  splitBy = 'words',
  staggerDelay = 0.05,
  duration = 0.6,
  className,
  animateOnMount = true,
  ...props
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (animateOnMount) {
      const timer = setTimeout(() => setHasAnimated(true), 50);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount]);

  const items = splitBy === 'words' ? text.split(' ') : text.split('');

  return (
    <p
      ref={containerRef}
      className={cn('inline-flex flex-wrap overflow-hidden leading-normal', className)}
      {...props}
    >
      {items.map((item, index) => (
        <span
          key={index}
          className="inline-block transition-all ease-out"
          style={{
            transform: hasAnimated ? 'translateY(0)' : 'translateY(100%)',
            opacity: hasAnimated ? 1 : 0,
            transitionDuration: `${duration}s`,
            transitionDelay: `${index * staggerDelay}s`,
            marginRight: splitBy === 'words' && index !== items.length - 1 ? '0.25em' : '0',
          }}
        >
          {item === ' ' ? '\u00A0' : item}
        </span>
      ))}
    </p>
  );
};
