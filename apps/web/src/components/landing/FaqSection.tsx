'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How does the BYOK (Bring Your Own Key) Vault keep my API keys secure?',
    a: 'Karma uses KMS-wrapped AES-256-GCM envelope encryption. Each user gets a cryptographically distinct data encryption key. Keys are decrypted solely in-memory inside the Go gateway during active requests and are never stored in plain text or logged. Furthermore, outbound network calls are locked strictly to official LLM provider base-URLs.',
  },
  {
    q: 'Will my generated resumes pass enterprise ATS systems (Workday, Greenhouse, Lever)?',
    a: 'Yes. Karma strictly follows modern ATS parsing specifications: clean single-column hierarchy, standard section headers, zero multi-column table traps, and UTF-8 safe typography. The knapsack engine aligns your achievements with required keywords extracted from the target job description.',
  },
  {
    q: 'How does the Knapsack algorithm prevent 2nd-page overflow?',
    a: 'Unlike traditional tools that guess font sizes, Karma calculates exact character density budgets (e.g. 2,800 characters for standard 1-page templates) and solves a bounded 0/1 knapsack problem, maximizing semantic relevance while strictly staying under the character ceiling.',
  },
  {
    q: 'Where is my data stored and is it permanent?',
    a: 'Your career nodes and structured achievements are persisted in an immutable PostgreSQL database instance powered by Neon with pgvector embeddings and automated backups.',
  },
  {
    q: 'Why a one-time access fee instead of a monthly SaaS subscription?',
    a: 'We believe career tools should not extract monthly rent. By allowing you to bring your own LLM keys (or pay-as-you-go managed credits), we have zero recurring infrastructure overhead to pass on to you.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6 pt-4 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Everything You Need to Know
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-white hover:text-indigo-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
