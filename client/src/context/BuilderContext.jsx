import { createContext, useContext, useEffect, useState } from 'react';

import { mergeBuilderState } from '../data/defaultConfig';
import { useAuth } from './AuthContext';
import { loadLocalProject, saveLocalProject } from '../services/builderStorage';

const BuilderContext = createContext(null);

export const BuilderProvider = ({ children }) => {
  const { client } = useAuth();
  const [builderState, setBuilderState] = useState(() => mergeBuilderState(loadLocalProject()));

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

  return (
    <BuilderContext.Provider
      value={{
        builderState,
        updateProject,
        updateSection,
        replaceBuilderState
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);

  if (!context) {
    throw new Error('useBuilder must be used inside BuilderProvider');
  }

  return context;
};
