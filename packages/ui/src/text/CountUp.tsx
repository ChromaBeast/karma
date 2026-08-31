'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../utils/cn';

export interface CountUpProps extends React.HTMLAttributes<HTMLSpanElement> {
  to: number;
  from?: number;
  duration?: number; // in seconds
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className,
  ...props
}) => {
  const [value, setValue] = useState(from);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / (duration * 1000), 1);
      const easedProgress = easeOutCubic(progress);
      const current = from + (to - from) * easedProgress;

      setValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    startTime.current = null;
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [from, to, duration]);

  const formattedNumber = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const display = separator !== ',' ? formattedNumber.replace(/,/g, separator) : formattedNumber;

  return (
    <span className={cn('inline-block font-mono tracking-tight tabular-nums', className)} {...props}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};
