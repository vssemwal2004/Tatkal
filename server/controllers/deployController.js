const Client = require('../models/Client');
const Design = require('../models/Design');

const generateCredentialValue = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;

const deploySystem = async (req, res, next) => {
  try {
    const { clientId } = req.body;

    if (!clientId) {
      return res.status(400).json({ message: 'clientId is required' });
    }

    const client = await Client.findOne({ clientId }).lean();

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const latestDesign = await Design.findOne({ clientId }).sort({ createdAt: -1 });

    if (!latestDesign) {
      return res.status(404).json({ message: 'No design request found for this client' });
    }

    const username = `${clientId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 12) || 'site'}_admin`;
    const password = generateCredentialValue('tatkal');
    const url = `/site/${clientId}`;
    const deployedAt = new Date();

    latestDesign.status = 'deployed';
    latestDesign.deployment = {
      url,
      username,
      password,
      deployedAt
    };
    await latestDesign.save();

    return res.status(200).json({
      message: `Deployment completed successfully for ${client.name}`,
      deployment: {
        clientId,
        status: latestDesign.status,
        url,
        username,
        password,
        deployedAt
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
      status: design.status,
      createdAt: design.createdAt,
      deployedAt: design.deployment?.deployedAt || design.createdAt,
      url: design.deployment?.url || `/site/${design.clientId}`,
      username: design.deployment?.username || null
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
