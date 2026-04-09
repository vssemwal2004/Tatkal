const Design = require('../models/Design');
const { buildSummary } = require('./designController');

const getClientStatus = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    if (req.user?.role !== 'admin' && req.user?.clientId !== clientId) {
      return res.status(403).json({ message: 'You do not have access to this project status' });
    }

    const design = await Design.findOne({ clientId }).sort({ createdAt: -1 }).lean();

    if (!design) {
      return res.status(404).json({ message: 'Project status not found' });
    }

    return res.status(200).json({
      clientId,
      status: design.status,
      url: design.deployment?.url || null,
      credentials: {
        username: design.deployment?.username || '',
        password: design.deployment?.password || ''
      },
      summary: buildSummary(design.config),
      updatedAt: design.updatedAt
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getClientStatus
};
