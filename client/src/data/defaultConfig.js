const createProjectId = () => `client_${Date.now()}`;

export const createDefaultBuilderState = () => ({
  project: {
    clientId: createProjectId(),
    mode: 'frontend-backend',
    projectName: '',
    ownerName: '',
    contactEmail: '',
    businessType: 'travel'
  },
  loginPage: {
    logo: '',
    headline: 'Welcome back',
    subheading: 'Launch premium booking experiences in minutes.',
    showUsername: true,
    showPassword: true,
    showForgotPassword: true,
    signUpName: true,
    signUpEmail: true,
    signUpPassword: true,
    backgroundColor: '#07111f',
    buttonColor: '#3dd9c5',
    textColor: '#eef2ff'
  },
  dashboard: {
    backgroundImage: '',
    width: 88,
    height: 74,
    cardSize: 72,
    fromLabel: 'From',
    toLabel: 'To',
    buttonLabel: 'Search journeys',
    buttonColor: '#3dd9c5',
    textColor: '#f8fafc',
    panelColor: 'rgba(7, 17, 31, 0.84)'
  },
  seatSelection: {
    layout: '2x2',
    availableColor: '#7dd3fc',
    selectedColor: '#3dd9c5',
    bookedColor: '#f97360'
  },
  payment: {
    accentColor: '#3dd9c5',
    surfaceColor: '#0c1728',
    textColor: '#f8fafc',
    buttonStyle: 'rounded',
    options: {
      upi: true,
      card: true,
      netBanking: true,
      wallet: false
    }
  },
  history: {
    layout: 'table',
    surfaceColor: '#0c1728',
    textColor: '#e2e8f0',
    headerColor: '#3dd9c5'
  }
});

export const mergeBuilderState = (source) => {
  const defaults = createDefaultBuilderState();

  if (!source) {
    return defaults;
  }

  return {
    ...defaults,
    ...source,
    project: {
      ...defaults.project,
      ...source.project
    },
    loginPage: {
      ...defaults.loginPage,
      ...source.loginPage
    },
    dashboard: {
      ...defaults.dashboard,
      ...source.dashboard
    },
    seatSelection: {
      ...defaults.seatSelection,
      ...source.seatSelection
    },
    payment: {
      ...defaults.payment,
      ...source.payment,
      options: {
        ...defaults.payment.options,
        ...source.payment?.options
      }
    },
    history: {
      ...defaults.history,
      ...source.history
    }
  };
};
