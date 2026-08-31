'use client';

import React, { useState, useRef } from 'react';
import { cn } from '../utils/cn';

export interface ElasticSliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  onChange?: (val: number) => void;
  className?: string;
}

export const ElasticSlider: React.FC<ElasticSliderProps> = ({
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit = '',
  onChange,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const percentage = ((value - min) / (max - min)) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setInternalValue(val);
    onChange?.(val);
  };

  return (
    <div className={cn('w-full flex flex-col gap-2 select-none', className)}>
      {label && (
        <div className="flex justify-between items-center text-xs font-medium text-neutral-400">
          <span>{label}</span>
          <span className="font-mono text-neutral-200">
            {value}
            {unit}
          </span>
        </div>
      )}

      <div
        ref={sliderRef}
        className="relative flex items-center h-8 group"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        {/* Track Background */}
        <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden relative">
          {/* Active Fill with glow */}
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{
              width: `${percentage}%`,
              boxShadow: isDragging ? '0 0 12px rgba(99, 102, 241, 0.6)' : 'none',
            }}
          />
        </div>

        {/* Custom Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 shadow-md transition-transform pointer-events-none"
          style={{
            left: `${percentage}%`,
            transform: `translate(-50%, -50%) scale(${isDragging ? 1.25 : 1})`,
          }}
        />

        {/* Native Range Input for accessibility & drag handling */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleInputChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
    </div>
  );
};
