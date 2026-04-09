import apiRequest from './api';

export const saveDesign = (payload) =>
  apiRequest('/design/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const submitDesign = (payload) =>
  apiRequest('/design/submit', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const trackProject = (clientId) => apiRequest(`/design/track/${clientId}`);
