import api from './api';

export const loginAdmin = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};
