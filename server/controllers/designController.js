const Client = require('../models/Client');
const Design = require('../models/Design');
const { ensureClientAccess } = require('../utils/clientAccess');

const buildSummary = (config = {}) => ({
  projectName: config.project?.projectName || 'Untitled Platform',
  businessType: config.project?.businessType || 'travel',
  mode: config.project?.mode || 'frontend-backend',
  completedSteps: ['loginPage', 'dashboard', 'seatSelection', 'payment', 'history'].filter((key) => Boolean(config[key]))
    .length,
  loginFields: {
    username: Boolean(config.loginPage?.showUsername),
    password: Boolean(config.loginPage?.showPassword),
    forgotPassword: Boolean(config.loginPage?.showForgotPassword)
  }
});

const canAccessClient = (req, clientId) => req.user?.role === 'admin' || req.user?.clientId === clientId;

const syncClientProfileFromConfig = async (clientId, config) => {
  const client = await Client.findOne({ clientId });

  if (!client) {
    return null;
  }

  const project = config?.project || {};
  client.name = project.projectName || project.ownerName || client.name;
  client.businessType = project.businessType || client.businessType || 'travel';
  await client.save();

  return client;
};

const saveDesign = async (req, res, next) => {
  try {
    const { clientId, config } = req.body;

    if (!clientId || !config) {
      return res.status(400).json({ message: 'clientId and config are required' });
    }

    if (!canAccessClient(req, clientId)) {
      return res.status(403).json({ message: 'You do not have access to this design' });
    }

    const client = await ensureClientAccess(req, res, clientId);

    if (!client) {
      return null;
    }

    let design = await Design.findOne({ clientId }).sort({ createdAt: -1 });

    if (!design) {
      design = new Design({
        clientId,
        config,
        status: 'pending'
      });
    } else {
      design.config = config;
      design.status = 'pending';
      design.deployment = {
        url: null,
        username: null,
        password: null,
        deployedAt: null
      };
    }

    await design.save();
    await syncClientProfileFromConfig(clientId, config);

    return res.status(200).json({
      message: 'Design saved successfully',
      design: {
        clientId: design.clientId,
        status: design.status,
        updatedAt: design.updatedAt,
        config: design.config
      },
      summary: buildSummary(design.config)
    });
  } catch (error) {
    return next(error);
  }
};

const getDesignByClientId = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    if (!canAccessClient(req, clientId)) {
      return res.status(403).json({ message: 'You do not have access to this design' });
    }

    const client = await ensureClientAccess(req, res, clientId);
    if (!client) {
      return null;
    }

    const design = await Design.findOne({ clientId }).sort({ createdAt: -1 }).lean();

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    return res.status(200).json({
      clientId,
      status: design.status,
      config: design.config,
      deployment: design.deployment || null,
      updatedAt: design.updatedAt,
      summary: buildSummary(design.config)
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  buildSummary,
  getDesignByClientId,
  saveDesign
};
