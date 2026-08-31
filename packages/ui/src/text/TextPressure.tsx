'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface TextPressureProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  minWeight?: number;
  maxWeight?: number;
  radius?: number;
  className?: string;
  charClassName?: string;
}

export const TextPressure: React.FC<TextPressureProps> = ({
  text,
  minWeight = 200,
  maxWeight = 900,
  radius = 150,
  className,
  charClassName,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const chars = text.split('');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  useEffect(() => {
    // Reset position if unmounted
    return () => setMousePos(null);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('inline-flex items-center justify-center select-none py-2', className)}
      {...props}
    >
      {chars.map((char, index) => {
        let weight = minWeight;
        let scale = 1;

        if (mousePos && containerRef.current) {
          const charElements = containerRef.current.querySelectorAll('.pressure-char');
          const charEl = charElements[index] as HTMLElement;
          if (charEl) {
            const charCenterX = charEl.offsetLeft + charEl.offsetWidth / 2;
            const charCenterY = charEl.offsetTop + charEl.offsetHeight / 2;
            const dist = Math.hypot(mousePos.x - charCenterX, mousePos.y - charCenterY);

            if (dist < radius) {
              const factor = 1 - dist / radius;
              weight = Math.round(minWeight + (maxWeight - minWeight) * factor);
              scale = 1 + 0.15 * factor;
            }
          }
        }

        return (
          <span
            key={index}
            className={cn('pressure-char inline-block transition-transform duration-75 ease-out', charClassName)}
            style={{
              fontWeight: weight,
              transform: `scale(${scale})`,
              transformOrigin: 'bottom center',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
};
