'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../utils/cn';

export interface DecryptedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  animateOn?: 'hover' | 'view' | 'mount';
  revealDirection?: 'start' | 'end' | 'center' | 'random';
  sequential?: boolean;
  className?: string;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  characters = DEFAULT_CHARS,
  animateOn = 'hover',
  revealDirection = 'start',
  sequential = true,
  className,
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const isAnimating = useRef(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  const scramble = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    let iteration = 0;
    const totalLength = text.length;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            let shouldReveal = false;

            if (sequential) {
              if (revealDirection === 'start') {
                shouldReveal = index < iteration / 2;
              } else if (revealDirection === 'end') {
                shouldReveal = index >= totalLength - iteration / 2;
              } else {
                shouldReveal = Math.abs(index - totalLength / 2) < iteration / 4;
              }
            } else {
              shouldReveal = iteration >= maxIterations;
            }

            if (shouldReveal) return text[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      iteration += 1;
      if (iteration > (sequential ? totalLength * 2 : maxIterations)) {
        clearInterval(interval);
        setDisplayText(text);
        isAnimating.current = false;
      }
    }, speed);
  }, [text, speed, maxIterations, characters, sequential, revealDirection]);

  useEffect(() => {
    if (animateOn === 'mount') {
      scramble();
    }
  }, [animateOn, scramble]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (animateOn === 'hover') scramble();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <span
      ref={elementRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('inline-block font-mono tracking-tight cursor-default', className)}
      data-hovered={isHovered}
      {...props}
    >
      {displayText}
    </span>
  );
};
