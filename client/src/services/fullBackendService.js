import api from './api';

export const fetchFullBackendInfo = async () => {
  const { data } = await api.get('/client/full-backend');
  return data?.data ?? data;
};

export const fetchFullBackendStatus = async () => {
  const { data } = await api.get('/client/full-backend/status');
  return data?.data ?? data;
};
