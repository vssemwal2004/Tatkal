const Client = require('../models/Client');
const Design = require('../models/Design');

const VALID_BUSINESS_TYPES = ['travel', 'event'];
const VALID_MODES = [
  'frontend-backend',
  'backend-only',
  'customize-backend-only'
];

const normalizeStatus = (status) => {
  if (status === 'approved') {
    return 'in_review';
  }

  return status;
};

const buildSummary = (config = {}) => ({
  projectName: config.project?.projectName || 'Untitled Project',
  businessType: config.project?.businessType || 'travel',
  mode: config.project?.mode || 'frontend-backend',
  accentColor: config.loginPage?.buttonColor || '#4d8af0',
  completedSteps: ['loginPage', 'dashboard', 'seatSelection', 'payment', 'history'].filter(
    (key) => Boolean(config[key])
  ).length,
  loginFields: {
    username: Boolean(config.loginPage?.showUsername),
    password: Boolean(config.loginPage?.showPassword),
    forgotPassword: Boolean(config.loginPage?.showForgotPassword)
  },
  historyLayout: config.history?.layout || 'table'
});

const upsertClient = async ({ clientId, clientName, businessType, email }) => {
  const existingClient = await Client.findOne({ clientId });

  if (existingClient) {
    existingClient.name = clientName;
    existingClient.businessType = businessType;
    if (email) {
      existingClient.email = email;
    }
    await existingClient.save();
    return existingClient;
  }

  const client = await Client.create({
    clientId,
    name: clientName,
    email,
    password: `temp-${clientId}`,
    businessType
  });

  return client;
};

const validatePayload = (payload) => {
  const { clientId, clientName, businessType, config, mode, email } = payload;

  if (!clientId || !clientName || !config || !email) {
    return 'clientId, clientName, email, and config are required';
  }

  if (!VALID_BUSINESS_TYPES.includes(businessType)) {
    return 'businessType must be travel or event';
  }

  if (mode && !VALID_MODES.includes(mode)) {
    return 'mode is invalid';
  }

  return null;
};

const saveDesignDraft = async (req, res, next) => {
  try {
    const validationError = validatePayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { clientId, clientName, businessType, config, email } = req.body;
    const systemType = req.body.systemType || businessType;

    await upsertClient({ clientId, clientName, businessType, email });

    let design = await Design.findOne({ clientId, status: 'draft' }).sort({ createdAt: -1 });

    if (!design) {
      design = new Design({
        clientId,
        config,
        status: 'draft',
        systemType,
        updatedAt: new Date()
      });
    } else {
      design.config = config;
      design.systemType = systemType;
      design.updatedAt = new Date();
    }

    await design.save();

    return res.status(200).json({
      message: 'Design draft saved',
      designId: design._id,
      clientId: design.clientId,
      status: design.status,
      updatedAt: design.updatedAt
    });
  } catch (error) {
    return next(error);
  }
};

const submitDesign = async (req, res, next) => {
  try {
    const validationError = validatePayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { clientId, clientName, businessType, config, email } = req.body;
    const systemType = req.body.systemType || businessType;

    await upsertClient({ clientId, clientName, businessType, email });

    let design = await Design.findOne({
      clientId,
      status: { $in: ['draft', 'pending'] }
    }).sort({ createdAt: -1 });

    if (!design) {
      design = new Design({
        clientId,
        config,
        status: 'pending',
        systemType
      });
    }

    design.config = config;
    design.systemType = systemType;
    design.status = 'pending';
    design.submittedAt = new Date();
    design.updatedAt = new Date();

    await design.save();

    return res.status(200).json({
      message: 'Design submitted successfully',
      project: {
        clientId: design.clientId,
        status: design.status,
        submittedAt: design.submittedAt,
        summary: buildSummary(config)
      }
    });
  } catch (error) {
    return next(error);
  }
};

const trackDesign = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const [client, design] = await Promise.all([
      Client.findOne({ clientId }).lean(),
      Design.findOne({ clientId }).sort({ createdAt: -1 }).lean()
    ]);

    if (!client || !design) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json({
      client: {
        clientId: client.clientId,
        name: client.name,
        businessType: client.businessType
      },
      project: {
        status: normalizeStatus(design.status),
        rawStatus: design.status,
        systemType: design.systemType,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
        submittedAt: design.submittedAt,
        summary: buildSummary(design.config),
        config: design.config
      },
      updates: [
        {
          title: 'Submission received',
          body: 'Your platform brief has been captured and is queued for review.',
          at: design.submittedAt || design.updatedAt || design.createdAt
        },
        {
          title: 'Admin review',
          body: 'Admin updates will appear here once the review workflow begins.',
          at: null
        }
      ]
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  saveDesignDraft,
  submitDesign,
  trackDesign
};
