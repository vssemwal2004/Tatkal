import api from './api';

export const fetchClients = async () => {
  const { data } = await api.get('/admin/clients');
  return data;
};
