import apiRequest from './api';

const AUTH_STORAGE_KEY = 'tatkal-auth-session';
const ADMIN_APP_URL = import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:5174/login';

export const registerAccount = (payload) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const loginAccount = (payload) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const saveAuthSession = (session) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const loadAuthSession = () => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse auth session:', error);
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getAdminAppUrl = () => ADMIN_APP_URL;
