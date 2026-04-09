const Client = require('../models/Client');
const Design = require('../models/Design');

const listClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 }).lean();

    const clientIds = clients.map((client) => client.clientId);
    const designs = await Design.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 }).lean();

    const latestByClient = designs.reduce((acc, design) => {
      if (!acc[design.clientId]) {
        acc[design.clientId] = design;
      }
      return acc;
    }, {});

    const payload = clients.map((client) => ({
      ...client,
      status: latestByClient[client.clientId]?.status || 'pending',
      lastRequestAt: latestByClient[client.clientId]?.createdAt || null,
      systemType: latestByClient[client.clientId]?.systemType || null,
      deployedAt: latestByClient[client.clientId]?.deployedAt || null
    }));

    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listClients
};
