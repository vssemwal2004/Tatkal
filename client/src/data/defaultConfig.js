const createProjectId = () => `client_${Date.now()}`;

const defaultRoutes = [
  {
    id: 'route-1',
    from: 'Ahmedabad',
    to: 'Mumbai',
    operator: 'Royal Express',
    departure: '07:15',
    arrival: '17:45',
    duration: '10h 30m',
    price: 1240,
    seatsLeft: 8
  },
  {
    id: 'route-2',
    from: 'Ahmedabad',
    to: 'Mumbai',
    operator: 'Metro Sleeper',
    departure: '09:30',
    arrival: '20:05',
    duration: '10h 35m',
    price: 1480,
    seatsLeft: 4
  },
  {
    id: 'route-3',
    from: 'Surat',
    to: 'Pune',
    operator: 'Western Connect',
    departure: '21:00',
    arrival: '06:50',
    duration: '9h 50m',
    price: 1180,
    seatsLeft: 11
  }
];

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
    subheading: 'Book routes faster with a cleaner and more reliable travel experience.',
    registerHeadline: 'Create customer account',
    registerSubheading: 'Register to start booking routes and managing seats.',
    showUsername: true,
    showPassword: true,
    showForgotPassword: true,
    signUpName: true,
    signUpEmail: true,
    signUpPassword: true,
    backgroundColor: '#f8fafc',
    buttonColor: '#2563eb',
    textColor: '#0f172a'
  },
  dashboard: {
    backgroundImage: '',
    width: 92,
    height: 76,
    cardSize: 78,
    fromLabel: 'From',
    toLabel: 'To',
    buttonLabel: 'Search routes',
    buttonColor: '#2563eb',
    textColor: '#0f172a',
    panelColor: 'rgba(255, 255, 255, 0.92)'
  },
  seatSelection: {
    layout: '2x2',
    availableColor: '#bfdbfe',
    selectedColor: '#2563eb',
    bookedColor: '#fb7185'
  },
  payment: {
    accentColor: '#2563eb',
    surfaceColor: '#ffffff',
    textColor: '#0f172a',
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
    surfaceColor: '#ffffff',
    textColor: '#1e293b',
    headerColor: '#2563eb'
  },
  routes: defaultRoutes
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
    },
    routes:
      Array.isArray(source.routes) && source.routes.length
        ? source.routes.map((route, index) => ({
            ...defaults.routes[index % defaults.routes.length],
            ...route
          }))
        : defaults.routes
  };
};
