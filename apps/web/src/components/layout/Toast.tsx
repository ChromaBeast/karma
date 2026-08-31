'use client';

import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        const borderColor = isSuccess
          ? 'border-emerald-500/40 shadow-emerald-950/40'
          : isError
          ? 'border-rose-500/40 shadow-rose-950/40'
          : isWarning
          ? 'border-amber-500/40 shadow-amber-950/40'
          : 'border-indigo-500/40 shadow-indigo-950/40';

        const bgGlow = isSuccess
          ? 'bg-emerald-950/20'
          : isError
          ? 'bg-rose-950/20'
          : isWarning
          ? 'bg-amber-950/20'
          : 'bg-indigo-950/20';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${borderColor} ${bgGlow} bg-neutral-900/95 backdrop-blur-xl shadow-2xl transition-all duration-300`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {isInfo && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}

            <div className="flex-1 space-y-0.5 min-w-0">
              <h4 className="text-xs font-bold text-white tracking-tight truncate">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-[11px] text-neutral-300 leading-relaxed break-words">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
