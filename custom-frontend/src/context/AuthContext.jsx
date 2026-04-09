import { createContext, useContext, useMemo, useState } from 'react';

import {
  clearAuthSession,
  loadAuthSession,
  loginAccount,
  registerAccount,
  saveAuthSession
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => loadAuthSession());

  const handleAuthSuccess = (data) => {
    const nextSession = {
      token: data.token,
      role: data.role,
      user: data.user
    };

    saveAuthSession(nextSession);
    setSession(nextSession);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      client: session?.role === 'client' ? session?.user || null : null,
      role: session?.role || null,
      isAuthenticated: Boolean(session?.token),
      register: async (payload) => {
        const data = await registerAccount(payload);
        handleAuthSuccess(data);
        return data;
      },
      login: async (payload) => {
        const data = await loginAccount(payload);
        handleAuthSuccess(data);
        return data;
      },
      logout: () => {
        clearAuthSession();
        setSession(null);
      }
    }),
    [session]
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
