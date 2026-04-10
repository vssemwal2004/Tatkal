import api from './api';

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data;
};

export const fetchRequests = async () => {
  const { data } = await api.get('/admin/requests');
  return data;
};

export const fetchRequestDetails = async (clientId) => {
  const { data } = await api.get(`/admin/request/${clientId}`);
  return data;
};

export const approveRequest = async (clientId) => {
  const { data } = await api.patch(`/admin/request/${clientId}/approve`);
  return data;
};

export const deleteRequest = async (clientId) => {
  const { data } = await api.delete(`/admin/request/${clientId}`);
  return data;
};

export const exportClientZip = async (clientId) => {
  const response = await api.post(`/admin/export/${clientId}`, {}, {
    responseType: 'blob'
  });
  return response.data;
};
