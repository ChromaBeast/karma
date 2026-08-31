'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface PixelTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number; // number of pixels along width
  pixelColor?: string;
  trigger?: 'hover' | 'click' | 'toggle';
  className?: string;
}

export const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 8,
  pixelColor = '#18181b',
  trigger = 'hover',
  className,
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);
  const [pixels, setPixels] = useState<number[]>([]);

  useEffect(() => {
    const total = gridSize * gridSize;
    const array = Array.from({ length: total }, (_, i) => i);
    // Shuffle array for random pixel reveal delays
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setPixels(array);
  }, [gridSize]);

  const handleEnter = () => {
    if (trigger === 'hover') setIsActive(true);
  };

  const handleLeave = () => {
    if (trigger === 'hover') setIsActive(false);
  };

  const handleClick = () => {
    if (trigger === 'click' || trigger === 'toggle') {
      setIsActive((prev) => !prev);
    }
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={cn('relative overflow-hidden cursor-pointer select-none rounded-xl', className)}
      {...props}
    >
      {/* Front / First Content */}
      <div
        className="transition-opacity duration-300 w-full h-full"
        style={{ opacity: isActive ? 0 : 1 }}
      >
        {firstContent}
      </div>

      {/* Back / Second Content */}
      <div
        className="absolute inset-0 transition-opacity duration-300 w-full h-full"
        style={{ opacity: isActive ? 1 : 0 }}
      >
        {secondContent}
      </div>

      {/* Pixel Grid Mask Layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {pixels.map((order, idx) => (
          <div
            key={idx}
            className="w-full h-full transition-opacity ease-in-out"
            style={{
              backgroundColor: pixelColor,
              opacity: isActive ? 0 : 0,
              transitionDuration: '0.2s',
              transitionDelay: `${order * 6}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
