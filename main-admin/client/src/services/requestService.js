import api from './api';

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/requests/stats/overview');
  return data;
};

export const fetchPendingRequests = async () => {
  const { data } = await api.get('/requests');
  return data;
};

export const fetchRequestDetails = async (clientId) => {
  const { data } = await api.get(`/requests/${clientId}`);
  return data;
};

export const approveRequest = async (clientId) => {
  const { data } = await api.patch(`/requests/${clientId}/approve`);
  return data;
};
