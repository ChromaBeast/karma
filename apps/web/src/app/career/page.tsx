'use client';

import React, { useState } from 'react';
import { Plus, GitBranch, ArrowDownUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CareerNodeFilter } from '../../components/career/CareerNodeFilter';
import { CareerNodeCard } from '../../components/career/CareerNodeCard';
import { EventPoller } from '../../components/career/EventPoller';
import { EventCaptureModal } from '../../components/career/EventCaptureModal';
import { DecryptedText } from '@karma/ui';

export default function CareerGraphPage() {
  const { nodes } = useApp();
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredNodes = nodes.filter((n) => {
    const matchesType = selectedType === 'all' || n.nodeType === selectedType;
    const matchesSearch =
      searchQuery === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.result && n.result.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Dynamic Career Graph
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
              <DecryptedText text="pgvector HNSW" speed={25} />
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Immutable event-sourced achievement log structured with STAR/XYZ metrics.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Capture Event</span>
        </button>
      </div>

      {/* Ingestion Status Pipeline Component */}
      <EventPoller />

      {/* Interactive Filters */}
      <CareerNodeFilter
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Nodes Timeline Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
          <span>{filteredNodes.length} Structured Nodes In Index</span>
          <span className="flex items-center gap-1">
            <ArrowDownUp className="w-3 h-3" /> Sorted by Recency & Metric Impact
          </span>
        </div>

        {filteredNodes.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <GitBranch className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-400">No nodes match your filter criteria.</p>
            <p className="text-xs text-neutral-500 mt-1">Capture new achievements using the Quick Capture button.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNodes.map((node) => (
              <CareerNodeCard key={node.id} node={node} />
            ))}
          </div>
        )}
      </div>

      {showModal && <EventCaptureModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
