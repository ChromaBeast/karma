'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, LayoutDashboard, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UserDropdown: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={openAuthModal}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
      >
        <span>Sign In</span>
      </button>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'KM';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
          {initials}
        </div>
        <span className="text-xs font-medium text-neutral-200 hidden sm:inline-block max-w-[100px] truncate">
          {user.name}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-neutral-900 border border-neutral-800 p-2 shadow-2xl z-50 text-white space-y-2 animate-in fade-in">
          {/* User Details */}
          <div className="px-3 py-2 border-b border-neutral-800 space-y-1">
            <div className="text-xs font-bold text-white truncate">{user.name}</div>
            <div className="text-[11px] text-neutral-400 truncate">{user.email}</div>
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-[10px] text-indigo-300 font-medium">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{user.planTier === 'access_plus_credits' ? 'Access + Credits' : 'Access Tier'}</span>
            </div>
          </div>

          {/* Quick Dashboard Link */}
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>Dashboard Overview</span>
          </Link>

          {/* Logout Action */}
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors border-t border-neutral-800/60 pt-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
