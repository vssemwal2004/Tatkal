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
    const { email, password } = req.body;

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

    await User.create({
      email: normalizedEmail,
      password,
      role: 'client'
    });

    return res.status(201).json({
      message: 'Client account created successfully',
      user: {
        email: normalizedEmail,
        role: 'client'
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

    if (!user || user.role !== 'client') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

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
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
};

module.exports = {
  ensureClientProfile,
  login,
  register
};
