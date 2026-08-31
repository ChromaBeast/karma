'use client';

import React from 'react';
import { cn } from '../utils/cn';

export interface StepItem {
  id: string | number;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
  onStepClick?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  className,
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'w-full flex',
        isHorizontal ? 'flex-row items-center justify-between' : 'flex-col gap-6',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div
              onClick={() => onStepClick?.(index)}
              className={cn(
                'flex items-center gap-3 cursor-pointer group select-none transition-colors',
                isHorizontal ? 'flex-col sm:flex-row text-center sm:text-left' : 'flex-row'
              )}
            >
              {/* Step Circle Badge */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-300',
                  isCompleted
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : isCurrent
                    ? 'border-indigo-500 bg-indigo-950/60 text-indigo-400 ring-4 ring-indigo-500/20'
                    : 'border-neutral-700 bg-neutral-900 text-neutral-400 group-hover:border-neutral-500'
                )}
              >
                {isCompleted ? '✓' : index + 1}
              </div>

              {/* Step Text Info */}
              <div className="flex flex-col">
                <span
                  className={cn(
                    'text-xs font-medium transition-colors',
                    isCurrent ? 'text-white font-semibold' : isCompleted ? 'text-neutral-300' : 'text-neutral-500'
                  )}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-[10px] text-neutral-500 hidden sm:inline-block">
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {/* Connecting Bar */}
            {index < steps.length - 1 && isHorizontal && (
              <div className="flex-1 mx-3 h-[2px] bg-neutral-800 relative hidden sm:block">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
