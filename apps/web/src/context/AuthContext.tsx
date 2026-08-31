'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../lib/types';
import { api, getStoredTokens } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, name?: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'alex.chen@karma.app',
  name: 'Alex Chen',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  headline: 'Staff Systems Architect · Ex-Stripe',
  planTier: 'access_plus_credits',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const initAuth = useCallback(async () => {
    setIsLoading(true);
    const { accessToken, refreshToken } = getStoredTokens();
    if (accessToken || refreshToken) {
      try {
        const me = await api.getMe();
        setUser(me);
      } catch {
        // Try refresh
        const refreshed = await api.refreshSession();
        if (refreshed) {
          try {
            const me = await api.getMe();
            setUser(me);
          } catch {
            setUser(DEMO_USER);
          }
        } else {
          setUser(null);
        }
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Periodic token refresh rotation (every 10 minutes)
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      await api.refreshSession().catch(() => {});
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, name?: string) => {
    setIsLoading(true);
    try {
      const session = await api.login(email, name);
      setUser(session.user);
      setIsAuthModalOpen(false);
    } catch {
      // Offline fallback
      setUser({
        id: `user-${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        planTier: 'access_plus_credits',
      });
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    await login('alex.chen@karma.app', 'Alex Chen');
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const refreshAuth = async () => {
    await api.refreshSession();
    const me = await api.getMe().catch(() => null);
    if (me) setUser(me);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        demoLogin,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
