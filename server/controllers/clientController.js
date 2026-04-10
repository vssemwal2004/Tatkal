const Client = require('../models/Client');
const Booking = require('../models/Booking');
const Design = require('../models/Design');
const Payment = require('../models/Payment');
const SeatLock = require('../models/SeatLock');

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
      isActive: client.isActive !== false,
      status: latestByClient[client.clientId]?.status || 'pending',
      lastRequestAt: latestByClient[client.clientId]?.createdAt || null,
      deployedAt: latestByClient[client.clientId]?.deployment?.deployedAt || null,
      siteUrl: latestByClient[client.clientId]?.deployment?.url || null
    }));

    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

const updateClientStatus = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive (boolean) is required' });
    }

    const client = await Client.findOne({ clientId });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    client.isActive = isActive;
    await client.save();

    return res.status(200).json({
      message: isActive ? 'Client activated successfully' : 'Client disabled successfully',
      client: {
        clientId: client.clientId,
        name: client.name,
        isActive: client.isActive
      }
    });
  } catch (error) {
    return next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findOne({ clientId }).lean();

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await Promise.all([
      Client.deleteOne({ clientId }),
      Design.deleteMany({ clientId }),
      Booking.deleteMany({ clientId }),
      Payment.deleteMany({ clientId }),
      SeatLock.deleteMany({ clientId })
    ]);

    return res.status(200).json({
      message: 'Client removed successfully. This client ID can no longer access backend APIs.'
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listClients,
  updateClientStatus,
  deleteClient
};
