const jwt = require('jsonwebtoken');
const { getClientAccess } = require('../utils/clientAccess');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload?.role === 'client') {
      if (!payload.clientId) {
        return res.status(401).json({ message: 'Client token is invalid' });
      }

      const access = await getClientAccess(payload.clientId);

      if (!access.allowed) {
        return res.status(access.statusCode).json({ message: access.message });
      }
    }

    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access is required' });
  }

  return next();
};

module.exports = {
  verifyToken,
  requireAdmin
};
