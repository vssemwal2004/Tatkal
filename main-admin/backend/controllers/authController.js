const Client = require('../models/Client');
const User = require('../models/User');
const signToken = require('../utils/signToken');

const login = async (req, res, next) => {
  try {
    const { email, password, role = 'admin' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (role === 'client') {
      const client = await Client.findOne({ email: email.toLowerCase() }).select('+password');

      if (!client) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await client.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = signToken({
        id: client._id,
        clientId: client.clientId,
        email: client.email,
        role: 'client'
      });

      return res.status(200).json({
        message: 'Client login successful',
        token,
        role: 'client',
        user: {
          clientId: client.clientId,
          name: client.name,
          email: client.email,
          businessType: client.businessType,
          role: 'client'
        }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
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
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};

const createClientId = () => `tatkal-${Math.random().toString(36).slice(2, 10)}`;

const register = async (req, res, next) => {
  try {
    const { name, email, password, businessType = 'travel' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingClient = await Client.findOne({ email: email.toLowerCase() });

    if (existingClient) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const client = await Client.create({
      clientId: createClientId(),
      name,
      email: email.toLowerCase(),
      password,
      businessType
    });

    const token = signToken({
      id: client._id,
      clientId: client.clientId,
      email: client.email,
      role: 'client'
    });

    return res.status(201).json({
      message: 'Client account created successfully',
      token,
      role: 'client',
      user: {
        clientId: client.clientId,
        name: client.name,
        email: client.email,
        businessType: client.businessType,
        role: 'client'
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
  register
};
