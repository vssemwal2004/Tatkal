import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginAdmin } from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

const safeParseUser = () => {
  try {
    const raw = localStorage.getItem('tatkal_user');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    localStorage.removeItem('tatkal_user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('tatkal_token'));
  const [user, setUser] = useState(safeParseUser);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginAdmin(email, password);
      localStorage.setItem('tatkal_token', response.token);
      localStorage.setItem('tatkal_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('tatkal_token');
    localStorage.removeItem('tatkal_user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem('tatkal_token');
      localStorage.removeItem('tatkal_user');
      setToken(null);
      setUser(null);
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectedToken = params.get('token');
    const redirectedEmail = params.get('email');

    if (!redirectedToken) {
      return;
    }

    const nextUser = {
      email: redirectedEmail || 'admin@tatkal.io',
      role: 'admin'
    };

    localStorage.setItem('tatkal_token', redirectedToken);
    localStorage.setItem('tatkal_user', JSON.stringify(nextUser));
    setToken(redirectedToken);
    setUser(nextUser);

    params.delete('token');
    params.delete('email');
    const nextQuery = params.toString();
    navigate(
      {
        pathname: '/',
        search: nextQuery ? `?${nextQuery}` : ''
      },
      { replace: true }
    );
  }, [navigate]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [token, user, loading]
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
