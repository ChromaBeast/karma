'use client';

import React from 'react';
import { Layers, Type, Sparkles, Layout } from 'lucide-react';

export type ShowcaseCategory = 'all' | 'text' | 'cards' | 'frames';

interface ShowcaseFilterProps {
  currentCategory: ShowcaseCategory;
  onSelectCategory: (cat: ShowcaseCategory) => void;
}

const CATEGORIES: { id: ShowcaseCategory; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Components', icon: Layers },
  { id: 'text', label: 'Text Animations', icon: Type },
  { id: 'cards', label: 'Cards & Lighting', icon: Sparkles },
  { id: 'frames', label: 'Device & Code Frames', icon: Layout },
];

export const ShowcaseFilter: React.FC<ShowcaseFilterProps> = ({
  currentCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = currentCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isSelected
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
