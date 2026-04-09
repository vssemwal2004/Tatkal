import api from './api';

export const deploySystem = async (payload) => {
  const { data } = await api.post('/deploy', payload);
  return data;
};

export const fetchDeployments = async () => {
  const { data } = await api.get('/deploy');
  return data;
};
