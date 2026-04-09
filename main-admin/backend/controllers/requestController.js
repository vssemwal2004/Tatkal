const Client = require('../models/Client');
const Design = require('../models/Design');

const buildClientMap = (clients) =>
  clients.reduce((acc, client) => {
    acc[client.clientId] = client;
    return acc;
  }, {});

const getPendingRequests = async (req, res, next) => {
  try {
    const designs = await Design.find({ status: 'pending' }).sort({ createdAt: -1 }).lean();

    const clientIds = [...new Set(designs.map((design) => design.clientId))];
    const clients = await Client.find({ clientId: { $in: clientIds } }).lean();
    const clientMap = buildClientMap(clients);

    const payload = designs.map((design) => ({
      clientId: design.clientId,
      clientName: clientMap[design.clientId]?.name || 'Unknown Client',
      businessType: clientMap[design.clientId]?.businessType || 'travel',
      status: design.status,
      createdAt: design.createdAt,
      systemType: design.systemType || null
    }));

    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

const getRequestByClientId = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const design = await Design.findOne({ clientId }).sort({ createdAt: -1 }).lean();

    if (!design) {
      return res.status(404).json({ message: 'Design request not found for this client' });
    }

    const client = await Client.findOne({ clientId }).lean();
    const config = design.config || {};

    return res.status(200).json({
      client: client || null,
      design,
      sections: {
        loginPage: config.loginPage || config.login || {},
        dashboard: config.dashboard || {},
        seatSelection: config.seatSelection || config.seat || {},
        payment: config.payment || {},
        history: config.history || {}
      }
    });
  } catch (error) {
    return next(error);
  }
};

const approveRequest = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const existing = await Design.findOne({ clientId }).sort({ createdAt: -1 });

    if (!existing) {
      return res.status(404).json({ message: 'Design request not found for this client' });
    }

    if (existing.status === 'deployed') {
      return res.status(400).json({ message: 'This design has already been deployed' });
    }

    if (existing.status === 'approved') {
      return res.status(200).json({
        message: 'Request is already approved',
        design: existing.toObject()
      });
    }

    existing.status = 'approved';
    await existing.save();

    return res.status(200).json({
      message: 'Request approved successfully',
      design: existing.toObject()
    });
  } catch (error) {
    return next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const [totalClients, totalRequests, deployedProjects, pendingRequests, approvedRequests] = await Promise.all([
      Client.countDocuments(),
      Design.countDocuments(),
      Design.countDocuments({ status: 'deployed' }),
      Design.countDocuments({ status: 'pending' }),
      Design.countDocuments({ status: 'approved' })
    ]);

    return res.status(200).json({
      totalClients,
      totalRequests,
      deployedProjects,
      pendingRequests,
      approvedRequests
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getPendingRequests,
  getRequestByClientId,
  approveRequest,
  getDashboardStats
};
