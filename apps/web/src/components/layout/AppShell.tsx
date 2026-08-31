'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <div className="flex flex-1 w-full">
      {!isLandingPage && <Sidebar />}
      <main className={`flex-1 overflow-y-auto ${isLandingPage ? 'w-full' : ''}`}>
        {children}
      </main>
    </div>
  );
};
