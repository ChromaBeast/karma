'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface CareerNodeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const TYPES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Artifacts' },
  { id: 'role', label: 'Roles' },
  { id: 'project', label: 'Projects' },
  { id: 'achievement', label: 'Key Achievements' },
];

export const CareerNodeFilter: React.FC<CareerNodeFilterProps> = ({
  selectedType,
  onTypeChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      {/* Type Pill Selector */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900/80 border border-neutral-800 rounded-xl overflow-x-auto">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => onTypeChange(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedType === t.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by skill, metric, or tag..."
          className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
