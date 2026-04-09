import api from './api';

const SESSION_KEY = 'tatkal_session';

export const loginAccount = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const registerAccount = async ({ email, password }) => {
  const { data } = await api.post('/auth/register', { email, password });
  return data;
};

export const saveAuthSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem('tatkal_token', session.token);
  localStorage.setItem('tatkal_user', JSON.stringify(session.user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('tatkal_token');
  localStorage.removeItem('tatkal_user');
};

export const loadAuthSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);

  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      clearAuthSession();
      return null;
    }
  }

  const legacyToken = localStorage.getItem('tatkal_token');
  const legacyUser = localStorage.getItem('tatkal_user');

  if (!legacyToken || !legacyUser) {
    return null;
  }

  try {
    const user = JSON.parse(legacyUser);
    return {
      token: legacyToken,
      role: user.role,
      user
    };
  } catch (error) {
    clearAuthSession();
    return null;
  }
};
