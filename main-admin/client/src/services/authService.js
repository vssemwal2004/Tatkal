import api from './api';

const CLIENT_APP_URL = import.meta.env.VITE_CLIENT_APP_URL || 'http://localhost:5173/login';

export const loginAccount = async ({ email, password, role }) => {
  const { data } = await api.post('/auth/login', { email, password, role });
  return data;
};

export const registerAccount = async ({ name, email, password, businessType }) => {
  const { data } = await api.post('/auth/register', { name, email, password, businessType });
  return data;
};

export const getClientAppUrl = () => CLIENT_APP_URL;
