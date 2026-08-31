'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface GalleryItem {
  id: string | number;
  title: string;
  subtitle?: string;
  image?: string;
}

export interface CircularGalleryProps {
  items: GalleryItem[];
  radius?: number;
  itemWidth?: number;
  itemHeight?: number;
  autoRotateSpeed?: number;
  className?: string;
}

export const CircularGallery: React.FC<CircularGalleryProps> = ({
  items,
  radius = 280,
  itemWidth = 180,
  itemHeight = 240,
  autoRotateSpeed = 0.003,
  className,
}) => {
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);

  useEffect(() => {
    let animId: number;
    const animate = () => {
      if (!isDragging.current) {
        setRotation((prev) => prev + autoRotateSpeed);
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [autoRotateSpeed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startRotation.current = rotation;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    setRotation(startRotation.current + deltaX * 0.005);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const total = items.length;

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={cn('relative w-full h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden', className)}
      style={{ perspective: '1200px' }}
    >
      <div
        className="relative w-0 h-0 transition-transform duration-75 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {items.map((item, index) => {
          const angle = (index / total) * Math.PI * 2 + rotation;
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;
          const rotateY = (angle * 180) / Math.PI;

          return (
            <div
              key={item.id}
              className="absolute top-1/2 left-1/2 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-4 flex flex-col justify-end overflow-hidden"
              style={{
                width: `${itemWidth}px`,
                height: `${itemHeight}px`,
                transform: `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${rotateY}deg)`,
                opacity: z > -radius * 0.8 ? 1 : 0.2,
                backfaceVisibility: 'hidden',
              }}
            >
              {item.image && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
              )}
              <div className="relative z-10 bg-neutral-950/70 p-2 rounded backdrop-blur-sm">
                <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                {item.subtitle && <p className="text-[10px] text-neutral-400 truncate">{item.subtitle}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
