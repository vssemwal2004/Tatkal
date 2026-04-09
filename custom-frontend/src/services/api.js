const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const buildHeaders = (headers = {}) => ({
  'Content-Type': 'application/json',
  ...headers
});

const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options.headers)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export default apiRequest;
