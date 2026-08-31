'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Why a one-time fee instead of a monthly subscription?',
    a: 'Nobody wants a recurring $30/month bill for a tool they only actively use when changing jobs or doing performance reviews. You buy lifetime access once, and bring your own OpenAI or Anthropic API key to pay raw API costs (~$0.01 per resume).',
  },
  {
    q: 'How are my API keys protected?',
    a: 'Keys are encrypted with AES-256 before being written to our database. They are only decrypted in-memory during active generation requests and are never written to disk in plain text or logged.',
  },
  {
    q: 'Why does the resume builder enforce a strict 1-page limit?',
    a: 'Recruiters and hiring managers spend seconds reviewing resumes. When a resume spills onto a second page with two awkward leftover bullet points, it looks sloppy. Karma calculates character budgets to guarantee everything fits cleanly on one page.',
  },
  {
    q: 'Can I export all my data if I want to leave?',
    a: 'Yes. Your accomplishments, metrics, and history are yours. You can export everything to standard JSON or Markdown at any time with one click.',
  },
  {
    q: 'Which AI providers are supported?',
    a: 'You can connect API keys for Anthropic (Claude 3.5 Sonnet), OpenAI (GPT-4o, GPT-4o-mini), or Google Gemini.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6 pt-4 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Questions &amp; Answers</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Frequently asked questions
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
