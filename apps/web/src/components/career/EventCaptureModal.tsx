'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles, MessageSquare, Bot, Mic, CheckSquare, FileUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { CaptureChannel } from '../../lib/types';

interface EventCaptureModalProps {
  onClose: () => void;
}

const CHANNELS: { id: CaptureChannel; label: string; icon: React.ElementType }[] = [
  { id: 'quick_add', label: 'Quick Add', icon: Sparkles },
  { id: 'slack_bot', label: 'Slack Bot', icon: Bot },
  { id: 'chat', label: 'Chat Log', icon: MessageSquare },
  { id: 'voice', label: 'Voice Memo', icon: Mic },
  { id: 'check_in', label: 'Weekly Check-in', icon: CheckSquare },
  { id: 'resume_import', label: 'Resume Parse', icon: FileUp },
];

export const EventCaptureModal: React.FC<EventCaptureModalProps> = ({ onClose }) => {
  const { addEvent } = useApp();
  const { addToast } = useToast();
  const [rawText, setRawText] = useState('');
  const [channel, setChannel] = useState<CaptureChannel>('quick_add');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setSubmitting(true);
    addEvent(rawText.trim(), channel);
    addToast({
      title: 'Event Queued for Structuring',
      description: 'The background LLM worker is extracting STAR/XYZ metrics and embedding the node.',
      type: 'info',
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Capture Career Event</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Capture Channel Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {CHANNELS.map((c) => {
            const Icon = c.icon;
            const isSelected = channel === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setChannel(c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-medium border transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/50 text-indigo-300'
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-neutral-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Raw Text Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Raw Achievement / Shipped Work Text
            </label>
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. Led migration to Go-based microservices, reducing AWS p99 response times from 180ms to 24ms and cutting infrastructure compute spend by $240k/yr."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <p className="text-[11px] text-neutral-500 leading-normal">
            Karma will extract Situation/Task, Action, Result (STAR/XYZ) & quantifiable metrics into structured fields automatically.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-800 text-xs font-medium text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !rawText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium shadow-md shadow-indigo-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Queue Event</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
