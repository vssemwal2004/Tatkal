import api from './api';

export const fetchClients = async () => {
  const { data } = await api.get('/admin/clients');
  return data;
};

export const updateClientStatus = async (clientId, isActive) => {
  const { data } = await api.patch(`/admin/clients/${clientId}/status`, { isActive });
  return data;
};

export const deleteClient = async (clientId) => {
  const { data } = await api.delete(`/admin/clients/${clientId}`);
  return data;
};

export const updateFullBackendAccess = async (clientId, fullBackendEnabled) => {
  const { data } = await api.patch(`/admin/clients/${clientId}/full-backend`, { fullBackendEnabled });
  return data;
};
