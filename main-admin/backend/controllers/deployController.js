const Client = require('../models/Client');
const Design = require('../models/Design');

const deploySystem = async (req, res, next) => {
  try {
    const { clientId, systemType } = req.body;

    if (!clientId || !systemType) {
      return res.status(400).json({ message: 'clientId and systemType are required' });
    }

    if (!['travel', 'event'].includes(systemType)) {
      return res.status(400).json({ message: 'systemType must be either travel or event' });
    }

    const client = await Client.findOne({ clientId }).lean();

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const latestDesign = await Design.findOne({ clientId }).sort({ createdAt: -1 });

    if (!latestDesign) {
      return res.status(404).json({ message: 'No design request found for this client' });
    }

    latestDesign.status = 'deployed';
    latestDesign.systemType = systemType;
    latestDesign.deployedAt = new Date();
    await latestDesign.save();

    return res.status(200).json({
      message: `Deployment simulated successfully for ${client.name}`,
      data: {
        clientId,
        systemType,
        status: latestDesign.status,
        deployedAt: latestDesign.deployedAt
      }
    });
  } catch (error) {
    return next(error);
  }
};

const listDeployments = async (req, res, next) => {
  try {
    const deployedDesigns = await Design.find({ status: 'deployed' }).sort({ createdAt: -1 }).lean();

    const clientIds = [...new Set(deployedDesigns.map((item) => item.clientId))];
    const clients = await Client.find({ clientId: { $in: clientIds } }).lean();
    const clientMap = clients.reduce((acc, client) => {
      acc[client.clientId] = client;
      return acc;
    }, {});

    const payload = deployedDesigns.map((design) => ({
      clientId: design.clientId,
      clientName: clientMap[design.clientId]?.name || 'Unknown Client',
      businessType: clientMap[design.clientId]?.businessType || 'travel',
      systemType: design.systemType || clientMap[design.clientId]?.businessType || 'travel',
      status: design.status,
      createdAt: design.createdAt,
      deployedAt: design.deployedAt || design.createdAt
    }));

    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  deploySystem,
  listDeployments
};
