const fs = require('fs');
const path = require('path');

const TEMPLATE_ROOT = path.resolve(__dirname, '..', 'templates', 'generated-frontend');

const fallbackRoutes = [
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
  }
];

const normalizeRoute = (route, index) => ({
  id: String(route?.id || route?.routeId || `route-${index + 1}`),
  from: String(route?.from || route?.origin || 'Origin'),
  to: String(route?.to || route?.destination || 'Destination'),
  operator: String(route?.operator || route?.name || 'Tatkal Operator'),
  departure: String(route?.departure || '08:00'),
  arrival: String(route?.arrival || '18:00'),
  duration: String(route?.duration || '10h 00m'),
  price: Number(route?.price || 0) || 0,
  seatsLeft: Number(route?.seatsLeft || 12) || 12
});

const buildProjectData = ({ client, design }) => {
  const config = design?.config || {};
  const project = config.project || {};
  const loginPage = config.loginPage || config.login || {};
  const dashboard = config.dashboard || {};
  const seatSelection = config.seatSelection || config.seat || {};
  const payment = config.payment || {};
  const history = config.history || {};
  const routes = Array.isArray(config.routes) && config.routes.length ? config.routes : fallbackRoutes;

  return {
    generatedAt: new Date().toISOString(),
    backendBaseUrl: process.env.PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api',
    project: {
      clientId: client.clientId,
      projectName: project.projectName || client.name || 'Tatkal Generated Project',
      ownerName: project.ownerName || client.name || 'Client Owner',
      contactEmail: project.contactEmail || client.email || '',
      businessType: project.businessType || client.businessType || 'travel',
      mode: project.mode || 'frontend-backend'
    },
    config: {
      loginPage: {
        logo: loginPage.logo || '',
        headline: loginPage.headline || 'Welcome back',
        subheading:
          loginPage.subheading || 'Continue into your account and complete the booking flow page by page.',
        showUsername: loginPage.showUsername !== false,
        showPassword: loginPage.showPassword !== false,
        showForgotPassword: loginPage.showForgotPassword !== false,
        signUpName: loginPage.signUpName !== false,
        signUpEmail: loginPage.signUpEmail !== false,
        signUpPassword: loginPage.signUpPassword !== false,
        backgroundColor: loginPage.backgroundColor || '#f8fafc',
        buttonColor: loginPage.buttonColor || '#2563eb',
        textColor: loginPage.textColor || '#0f172a'
      },
      dashboard: {
        fromLabel: dashboard.fromLabel || 'From',
        toLabel: dashboard.toLabel || 'To',
        buttonLabel: dashboard.buttonLabel || 'Search routes',
        buttonColor: dashboard.buttonColor || '#2563eb',
        textColor: dashboard.textColor || '#0f172a',
        panelColor: dashboard.panelColor || 'rgba(255,255,255,0.92)'
      },
      seatSelection: {
        layout: seatSelection.layout || '2x2',
        availableColor: seatSelection.availableColor || '#bfdbfe',
        selectedColor: seatSelection.selectedColor || '#2563eb',
        bookedColor: seatSelection.bookedColor || '#fb7185'
      },
      payment: {
        accentColor: payment.accentColor || '#2563eb',
        surfaceColor: payment.surfaceColor || '#ffffff',
        textColor: payment.textColor || '#0f172a',
        buttonStyle: payment.buttonStyle || 'rounded',
        options: {
          upi: payment.options?.upi !== false,
          card: payment.options?.card !== false,
          netBanking: payment.options?.netBanking !== false,
          wallet: Boolean(payment.options?.wallet)
        }
      },
      history: {
        layout: history.layout || 'table',
        surfaceColor: history.surfaceColor || '#ffffff',
        textColor: history.textColor || '#1e293b',
        headerColor: history.headerColor || '#2563eb'
      }
    },
    routes: routes.map(normalizeRoute)
  };
};

const readTemplateFiles = (currentDir, relativeDir = '') => {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const absolutePath = path.join(currentDir, entry.name);
    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      return readTemplateFiles(absolutePath, relativePath);
    }

    return [
      {
        name: relativePath.replace(/\\/g, '/'),
        content: fs.readFileSync(absolutePath, 'utf8')
      }
    ];
  });
};

const createGeneratedProjectFiles = ({ client, design }) => {
  const files = readTemplateFiles(TEMPLATE_ROOT);
  const generatedConfig = buildProjectData({ client, design });

  files.push({
    name: 'src/generated-config.js',
    content: `window.__TATKAL_GENERATED_CONFIG__ = ${JSON.stringify(generatedConfig, null, 2)};\n`
  });

  return files;
};

module.exports = {
  createGeneratedProjectFiles
};
