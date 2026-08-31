'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '../utils/cn';

export interface DockItemData {
  id: string | number;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: string | number;
}

export interface DockProps {
  items: DockItemData[];
  magnification?: number;
  distance?: number;
  className?: string;
}

export const Dock: React.FC<DockProps> = ({
  items,
  magnification = 1.4,
  distance = 100,
  className,
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current) return;
    setMouseX(e.clientX);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  return (
    <div
      ref={dockRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'inline-flex items-end gap-3 px-4 py-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl shadow-2xl transition-all',
        className
      )}
    >
      {items.map((item) => (
        <DockButton
          key={item.id}
          item={item}
          mouseX={mouseX}
          magnification={magnification}
          distance={distance}
        />
      ))}
    </div>
  );
};

interface DockButtonProps {
  item: DockItemData;
  mouseX: number | null;
  magnification: number;
  distance: number;
}

const DockButton: React.FC<DockButtonProps> = ({
  item,
  mouseX,
  magnification,
  distance: maxDist,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  let scale = 1;
  if (mouseX !== null && buttonRef.current) {
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - centerX);
    if (dist < maxDist) {
      const factor = 1 - dist / maxDist;
      scale = 1 + (magnification - 1) * factor;
    }
  }

  return (
    <div className="relative flex flex-col items-center group">
      {/* Tooltip Label */}
      {isHovered && (
        <div className="absolute -top-9 px-2 py-1 bg-neutral-800 border border-neutral-700 text-white text-[11px] font-medium rounded-md shadow-lg whitespace-nowrap pointer-events-none transition-all">
          {item.label}
        </div>
      )}

      {/* Dock Icon Button */}
      <button
        ref={buttonRef}
        onClick={item.onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-700 transition-all duration-100 ease-out origin-bottom relative shadow"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {item.icon}
        {item.badge !== undefined && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-indigo-600 text-white text-[9px] font-bold rounded-full">
            {item.badge}
          </span>
        )}
      </button>
    </div>
  );
};
