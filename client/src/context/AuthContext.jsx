import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  clearAuthSession,
  loadAuthSession,
  loginAccount,
  registerAccount,
  saveAuthSession
} from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => loadAuthSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuthSession();
      setSession(null);
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  const handleAuthSuccess = (data) => {
    const nextSession = {
      token: data.token,
      role: data.role,
      user: data.user
    };

    saveAuthSession(nextSession);
    setSession(nextSession);
    return data;
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      role: session?.role || null,
      admin: session?.role === 'admin' ? session.user : null,
      client: session?.role === 'client' ? session.user : null,
      isAuthenticated: Boolean(session?.token),
      loading,
      register: async (payload) => {
        setLoading(true);
        try {
          return await registerAccount(payload);
        } finally {
          setLoading(false);
        }
      },
      login: async (payload) => {
        setLoading(true);
        try {
          const data = await loginAccount(payload);
          return handleAuthSuccess(data);
        } finally {
          setLoading(false);
        }
      },
      logout: () => {
        clearAuthSession();
        setSession(null);
      }
    }),
    [loading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
