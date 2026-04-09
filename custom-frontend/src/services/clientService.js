const PROJECT_STORAGE_KEY = 'tatkal-client-builder-project';
const TRACKING_STORAGE_KEY = 'tatkal-client-builder-tracking-id';

export const loadLocalProject = () => {
  const raw = localStorage.getItem(PROJECT_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse local project data:', error);
    return null;
  }
};

export const saveLocalProject = (builderState) => {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(builderState));
};

export const rememberTrackingId = (clientId) => {
  if (clientId) {
    localStorage.setItem(TRACKING_STORAGE_KEY, clientId);
  }
};

export const getRememberedTrackingId = () => localStorage.getItem(TRACKING_STORAGE_KEY) || '';

export const clearLocalProject = () => {
  localStorage.removeItem(PROJECT_STORAGE_KEY);
};
