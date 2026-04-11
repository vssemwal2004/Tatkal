const Client = require('../models/Client');

const getClientIdFromRequest = (req) =>
  req.query.clientId || req.headers['x-client-id'] || req.user?.clientId || '';

const ensureFullBackendEnabled = async (req, res, next) => {
  try {
    if (req.user?.role === 'admin') {
      return next();
    }

    const clientId = getClientIdFromRequest(req);
    if (!clientId) {
      return res.status(400).json({ message: 'clientId is required' });
    }

    const client = await Client.findOne({ clientId }).lean();
    if (!client) {
      return res.status(404).json({ message: 'Client ID not found. It may have been removed by admin.' });
    }

    if (!client.isActive) {
      return res.status(403).json({ message: 'This client ID is disabled by admin.' });
    }

    if (client.fullBackendEnabled !== true) {
      return res.status(403).json({ message: 'Full backend access is disabled for this client.' });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  ensureFullBackendEnabled
};
