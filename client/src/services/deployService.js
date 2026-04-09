import api from './api';

export const deploySystem = async (payload) => {
  const { data } = await api.post('/admin/deploy', payload);
  return data;
};

export const fetchDeployments = async () => {
  const { data } = await api.get('/admin/deployments');
  return data;
};
