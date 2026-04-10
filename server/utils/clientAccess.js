const Client = require('../models/Client');

const getClientAccess = async (clientId) => {
  if (!clientId) {
    return {
      allowed: false,
      statusCode: 400,
      message: 'clientId is required'
    };
  }

  const client = await Client.findOne({ clientId }).lean();

  if (!client) {
    return {
      allowed: false,
      statusCode: 404,
      message: 'Client ID not found. It may have been removed by admin.'
    };
  }

  if (!client.isActive) {
    return {
      allowed: false,
      statusCode: 403,
      message: 'This client ID is disabled by admin.'
    };
  }

  return {
    allowed: true,
    client
  };
};

const ensureClientAccess = async (req, res, clientId) => {
  if (req.user?.role !== 'admin' && req.user?.clientId !== clientId) {
    res.status(403).json({ message: 'You do not have access to this client ID' });
    return null;
  }

  const access = await getClientAccess(clientId);
  if (!access.allowed) {
    res.status(access.statusCode).json({ message: access.message });
    return null;
  }

  return access.client;
};

const ensureClientActive = async (req, res, clientId) => {
  const access = await getClientAccess(clientId);
  if (!access.allowed) {
    res.status(access.statusCode).json({ message: access.message });
    return null;
  }

  return access.client;
};

module.exports = {
  ensureClientAccess,
  ensureClientActive,
  getClientAccess
};
