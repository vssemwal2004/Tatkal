const Client = require('../models/Client');
const User = require('../models/User');
const signToken = require('../utils/signToken');

const createClientId = () => `client_${Date.now()}`;

const formatClientName = (email) =>
  email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Client';

const createClientAccessError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureClientProfile = async (user) => {
  if (user.clientId) {
    const linkedClient = await Client.findOne({ clientId: user.clientId });

    if (!linkedClient) {
      throw createClientAccessError('Client ID not found. It may have been removed by admin.', 403);
    }

    if (!linkedClient.isActive) {
      throw createClientAccessError('This client ID is disabled by admin.', 403);
    }

    if (!linkedClient.userId) {
      linkedClient.userId = user._id;
    }
    if (!linkedClient.email) {
      linkedClient.email = user.email;
    }
    await linkedClient.save();

    return linkedClient;
  }

  let client = await Client.findOne({
    $or: [{ userId: user._id }, { email: user.email }]
  });

  if (client) {
    if (!client.isActive) {
      throw createClientAccessError('This client ID is disabled by admin.', 403);
    }

    if (!client.userId) {
      client.userId = user._id;
    }
    if (!client.email) {
      client.email = user.email;
    }
    await client.save();

    if (user.clientId !== client.clientId) {
      user.clientId = client.clientId;
      await user.save();
    }

    return client;
  }

  client = await Client.create({
    clientId: createClientId(),
    userId: user._id,
    email: user.email,
    name: formatClientName(user.email),
    businessType: 'travel'
  });

  user.clientId = client.clientId;
  await user.save();

  return client;
};

const buildClientSession = (user, client) => ({
  email: user.email,
  role: user.role,
  clientId: client.clientId,
  name: client.name,
  businessType: client.businessType
});

const register = async (req, res, next) => {
  try {
    const { email, password, name, role, source } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail === process.env.ADMIN_EMAIL?.toLowerCase()) {
      return res.status(400).json({ message: 'This email is reserved for the admin account' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const isExternal = role === 'user' || source === 'external';
    const userRole = isExternal ? 'user' : 'client';

    await User.create({
      email: normalizedEmail,
      password,
      role: userRole,
      name: name || null
    });

    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        email: normalizedEmail,
        role: userRole,
        name: name || normalizedEmail.split('@')[0]
      }
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const envAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD;

    if (!envAdminEmail || !envAdminPassword) {
      return res.status(500).json({ message: 'Admin credentials are not configured on the server' });
    }

    if (normalizedEmail === envAdminEmail && password === envAdminPassword) {
      const adminUser = await User.findOne({ email: envAdminEmail }).select('+password');

      if (!adminUser) {
        return res.status(500).json({ message: 'Admin account has not been initialized yet' });
      }

      const isMatch = await adminUser.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Stored admin credentials are out of sync. Restart the server.' });
      }

      const token = signToken({
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role
      });

      return res.status(200).json({
        message: 'Login successful',
        token,
        role: adminUser.role,
        user: {
          email: adminUser.email,
          role: adminUser.role
        }
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || (user.role !== 'client' && user.role !== 'user')) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'client') {
      const client = await ensureClientProfile(user);
      const token = signToken({
        id: user._id,
        email: user.email,
        role: user.role,
        clientId: client.clientId
      });

      return res.status(200).json({
        message: 'Login successful',
        token,
        role: user.role,
        user: buildClientSession(user, client)
      });
    }

    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      user: {
        email: user.email,
        role: user.role,
        name: user.name || user.email.split('@')[0]
      }
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role === 'client' && req.user.clientId) {
      const client = await Client.findOne({ clientId: req.user.clientId }).lean();
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      return res.status(200).json({
        user: {
          email: req.user.email,
          role: req.user.role,
          clientId: req.user.clientId,
          name: client.name,
          businessType: client.businessType
        }
      });
    }

    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: {
        email: user.email,
        role: user.role,
        name: user.name || user.email.split('@')[0]
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  ensureClientProfile,
  login,
  register,
  getMe
};
