import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { mergeBuilderState } from '../data/defaultConfig';
import { useAuth } from './AuthContext';
import { loadLocalProject, rememberTrackingId, saveLocalProject } from '../services/builderStorage';
import { fetchDesign, saveDesign } from '../services/designService';

const BuilderContext = createContext(null);

export const BuilderProvider = ({ children }) => {
  const { client } = useAuth();
  const [builderState, setBuilderState] = useState(() => mergeBuilderState(loadLocalProject()));
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState('idle');
  const [lastSavedAt, setLastSavedAt] = useState('');
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    saveLocalProject(builderState);
  }, [builderState]);

  useEffect(() => {
    if (!client) {
      return;
    }

    setBuilderState((current) => {
      const shouldReset = current.project.clientId && current.project.clientId !== client.clientId;
      const baseState = shouldReset ? mergeBuilderState() : current;

      return {
        ...baseState,
        project: {
          ...baseState.project,
          clientId: client.clientId || baseState.project.clientId,
          ownerName: client.name || baseState.project.ownerName,
          contactEmail: client.email || baseState.project.contactEmail,
          businessType: client.businessType || baseState.project.businessType
        }
      }
    });
  }, [client]);

  useEffect(() => {
    let active = true;

    const loadExistingDesign = async () => {
      if (!client?.clientId) {
        if (active) {
          setHydrated(true);
        }
        return;
      }

      setHydrated(false);

      try {
        const data = await fetchDesign(client.clientId);

        if (active && data?.config) {
          setBuilderState((current) =>
            mergeBuilderState({
              ...current,
              ...data.config,
              project: {
                ...current.project,
                ...data.config.project,
                clientId: client.clientId
              }
            })
          );
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Failed to load existing design:', error);
        }
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    };

    loadExistingDesign();

    return () => {
      active = false;
    };
  }, [client?.clientId]);

  useEffect(() => {
    if (!hydrated || !builderState.project.clientId || !client?.clientId) {
      return undefined;
    }

    setSaveState('saving');

    const timer = setTimeout(async () => {
      try {
        const data = await saveDesign({
          clientId: builderState.project.clientId,
          config: builderState
        });

        rememberTrackingId(builderState.project.clientId);
        setSaveState('saved');
        setLastSavedAt(
          new Date(data.design?.updatedAt || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        );
      } catch (error) {
        setSaveState('error');
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [builderState, client?.clientId, hydrated]);

  const updateProject = (projectPatch) => {
    setBuilderState((current) => ({
      ...current,
      project: {
        ...current.project,
        ...projectPatch
      }
    }));
  };

  const updateSection = (sectionKey, nextValue) => {
    setBuilderState((current) => {
      const section = current[sectionKey];
      const resolvedValue =
        typeof nextValue === 'function' ? nextValue(section, current) : { ...section, ...nextValue };

      return {
        ...current,
        [sectionKey]: resolvedValue
      };
    });
  };

  const replaceBuilderState = (nextState) => {
    setBuilderState(mergeBuilderState(nextState));
  };

  const updateRoutes = (updater) => {
    setBuilderState((current) => ({
      ...current,
      routes: typeof updater === 'function' ? updater(current.routes || []) : updater
    }));
  };

  const submitDesign = async () => {
    if (!builderState.project.projectName.trim()) {
      setSubmitError('Set a platform name first so the design can be submitted.');
      return null;
    }

    setSubmitState('submitting');
    setSubmitError('');

    try {
      const response = await saveDesign({
        clientId: builderState.project.clientId,
        config: builderState
      });

      rememberTrackingId(builderState.project.clientId);
      setSubmitState('submitted');
      return response;
    } catch (error) {
      setSubmitState('error');
      setSubmitError(error.response?.data?.message || 'Failed to submit the design.');
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      builderState,
      hydrated,
      updateProject,
      updateSection,
      updateRoutes,
      replaceBuilderState,
      saveState,
      lastSavedAt,
      submitState,
      submitError,
      submitDesign,
      clearSubmitError: () => setSubmitError('')
    }),
    [builderState, hydrated, lastSavedAt, saveState, submitError, submitState]
  );

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);

  if (!context) {
    throw new Error('useBuilder must be used inside BuilderProvider');
  }

  return context;
};
