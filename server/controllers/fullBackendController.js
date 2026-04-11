const Client = require('../models/Client');

const getFullBackendInfo = async (req, res, next) => {
  try {
    if (req.user?.role !== 'admin') {
      const clientId = req.user?.clientId;
      const client = await Client.findOne({ clientId });

      if (!client) {
        return res.status(404).json({ message: 'Client ID not found. It may have been removed by admin.' });
      }

      if (!client.isActive) {
        return res.status(403).json({ message: 'This client ID is disabled by admin.' });
      }

      if (client.fullBackendEnabled !== true) {
        client.fullBackendEnabled = true;
        await client.save();
      }
    }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}/api`;

    return res.status(200).json({
      success: true,
      data: {
        baseUrl,
        fullBackendEnabled: true,
        note:
          'Set this as your API base URL in your app. All endpoints are available under this base URL.',
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getFullBackendStatus = async (req, res, next) => {
  try {
    const clientId = req.user?.clientId;
    const client = await Client.findOne({ clientId }).lean();

    if (!client) {
      return res.status(404).json({ message: 'Client ID not found. It may have been removed by admin.' });
    }

    if (!client.isActive) {
      return res.status(403).json({ message: 'This client ID is disabled by admin.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        fullBackendEnabled: client.fullBackendEnabled !== false
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFullBackendInfo,
  getFullBackendStatus
};
