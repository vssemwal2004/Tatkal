import api from './api';

export const saveDesign = async (payload) => {
  const { data } = await api.post('/design/save', payload);
  return data;
};

export const fetchDesign = async (clientId) => {
  const { data } = await api.get(`/design/${clientId}`);
  return data;
};

export const trackProject = async (clientId) => {
  const { data } = await api.get(`/client/status/${clientId}`);
  return data;
};
