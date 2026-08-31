'use client';

import React from 'react';
import { Briefcase, FolderGit2, Award, Trash2, Calendar, Tag } from 'lucide-react';
import { CareerNode } from '../../lib/types';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { StarMetricBadge } from './StarMetricBadge';
import { SpotlightCard } from '@karma/ui';

interface CareerNodeCardProps {
  node: CareerNode;
}

export const CareerNodeCard: React.FC<CareerNodeCardProps> = ({ node }) => {
  const { deleteNode } = useApp();
  const { addToast } = useToast();

  const getIcon = () => {
    switch (node.nodeType) {
      case 'role':
        return <Briefcase className="w-4 h-4 text-indigo-400" />;
      case 'project':
        return <FolderGit2 className="w-4 h-4 text-purple-400" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-amber-400" />;
      default:
        return <Award className="w-4 h-4 text-indigo-400" />;
    }
  };

  const handleDelete = () => {
    deleteNode(node.id);
    addToast({
      title: 'Node Removed',
      description: `Removed "${node.title}" from your career graph.`,
      type: 'info',
    });
  };

  return (
    <SpotlightCard className="p-5 space-y-3">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-neutral-800/80 border border-neutral-700/60">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white leading-tight">{node.title}</h4>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
              {node.org && <span className="font-medium text-neutral-300">{node.org}</span>}
              {node.startDate && (
                <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                  <Calendar className="w-3 h-3" />
                  {node.startDate} {node.endDate ? `— ${node.endDate}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="text-neutral-500 hover:text-rose-400 p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          title="Delete Node"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* STAR Framework Structured Blocks */}
      <div className="space-y-1.5 text-xs text-neutral-300 leading-relaxed bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/60">
        {node.situationTask && (
          <p>
            <strong className="text-neutral-400 font-medium">Context: </strong>
            {node.situationTask}
          </p>
        )}
        {node.action && (
          <p>
            <strong className="text-neutral-400 font-medium">Action: </strong>
            {node.action}
          </p>
        )}
        {node.result && (
          <p>
            <strong className="text-indigo-400 font-medium">Result: </strong>
            {node.result}
          </p>
        )}
      </div>

      {/* Metrics Badges */}
      <StarMetricBadge metrics={node.metrics} />

      {/* Tag Pills */}
      {node.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {node.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] text-neutral-400 font-medium"
            >
              <Tag className="w-2.5 h-2.5 text-neutral-500" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </SpotlightCard>
  );
};
