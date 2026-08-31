'use client';

import React, { useState } from 'react';
import { X, Sparkles, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ShinyText } from '@karma/ui';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await login(email, name);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemo = async () => {
    setIsSubmitting(true);
    try {
      await demoLogin();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 text-white">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
              K
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {mode === 'signin' ? 'Welcome Back to Karma' : 'Create Your Karma Account'}
              </h2>
              <p className="text-xs text-neutral-400">
                <ShinyText text="Your work, compounding." speed={3} />
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Instant Demo Button */}
        <button
          onClick={handleDemo}
          disabled={isSubmitting}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-700/60 hover:border-indigo-500 text-left transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-200">1-Click Instant Demo Access</div>
              <div className="text-[11px] text-neutral-400">Log in as Staff Engineer (pre-populated graph)</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="flex items-center gap-3 text-neutral-600 text-xs">
          <div className="flex-1 h-px bg-neutral-800" />
          <span>or sign in with email</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-300">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Chen"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300">Work / Personal Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Mode & Security Notice */}
        <div className="space-y-3 pt-1 border-t border-neutral-800/80">
          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
            <span>{mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}</span>
            <button
              onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
              className="text-indigo-400 hover:underline font-medium"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure 15-min JWT + Automatic Token Rotation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
