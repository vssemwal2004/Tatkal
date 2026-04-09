const Client = require('../models/Client');
const signToken = require('../utils/signToken');

const createClientId = () => `tatkal-${Math.random().toString(36).slice(2, 10)}`;

const buildAuthPayload = (client) => ({
  token: signToken({
    id: client._id,
    clientId: client.clientId,
    email: client.email,
    role: 'client'
  }),
  client: {
    clientId: client.clientId,
    name: client.name,
    email: client.email,
    businessType: client.businessType
  }
});

const registerClient = async (req, res, next) => {
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

    return res.status(201).json({
      message: 'Client account created successfully',
      ...buildAuthPayload(client)
    });
  } catch (error) {
    return next(error);
  }
};

const loginClient = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const client = await Client.findOne({ email: email.toLowerCase() }).select('+password');

    if (!client) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await client.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
      message: 'Client login successful',
      ...buildAuthPayload(client)
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerClient,
  loginClient
};
