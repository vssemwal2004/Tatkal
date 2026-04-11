const Route = require('../models/Route');

const getClientIdFromRequest = (req) =>
  req.query.clientId || req.headers['x-client-id'] || '';

const listPublicRoutes = async (req, res, next) => {
  try {
    const clientId = getClientIdFromRequest(req);
    if (!clientId) {
      return res.status(400).json({ message: 'clientId is required' });
    }

    const routes = await Route.find({ clientId, active: true }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ items: routes });
  } catch (error) {
    return next(error);
  }
};

const listPublicCities = async (req, res, next) => {
  try {
    const clientId = getClientIdFromRequest(req);
    if (!clientId) {
      return res.status(400).json({ message: 'clientId is required' });
    }

    const routes = await Route.find({ clientId, active: true }).lean();
    const cities = new Set();
    routes.forEach((route) => {
      if (route.from) cities.add(route.from);
      if (route.to) cities.add(route.to);
    });

    return res.status(200).json({ items: Array.from(cities).sort() });
  } catch (error) {
    return next(error);
  }
};

const listOwnerRoutes = async (req, res, next) => {
  try {
    if (!req.user?.clientId) {
      return res.status(403).json({ message: 'Owner access required' });
    }

    const routes = await Route.find({ clientId: req.user.clientId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ items: routes });
  } catch (error) {
    return next(error);
  }
};

const createOwnerRoute = async (req, res, next) => {
  try {
    if (!req.user?.clientId) {
      return res.status(403).json({ message: 'Owner access required' });
    }

    const { from, to, price, seatsLeft, totalSeats, departureTime, arrivalTime, operator, active } = req.body;
    if (!from || !to || price == null) {
      return res.status(400).json({ message: 'from, to, and price are required' });
    }

    const route = await Route.create({
      clientId: req.user.clientId,
      from,
      to,
      price: Number(price),
      seatsLeft: seatsLeft == null ? 12 : Number(seatsLeft),
      totalSeats: totalSeats == null ? 40 : Number(totalSeats),
      departureTime: departureTime || null,
      arrivalTime: arrivalTime || null,
      operator: operator || null,
      active: active !== false,
      createdBy: req.user.id
    });

    return res.status(201).json({ route });
  } catch (error) {
    return next(error);
  }
};

const updateOwnerRoute = async (req, res, next) => {
  try {
    if (!req.user?.clientId) {
      return res.status(403).json({ message: 'Owner access required' });
    }

    const { id } = req.params;
    const { from, to, price, seatsLeft, totalSeats, departureTime, arrivalTime, operator, active } = req.body;

    const route = await Route.findOne({ _id: id, clientId: req.user.clientId });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    if (from != null) route.from = from;
    if (to != null) route.to = to;
    if (price != null) route.price = Number(price);
    if (seatsLeft != null) route.seatsLeft = Number(seatsLeft);
    if (totalSeats != null) route.totalSeats = Number(totalSeats);
    if (departureTime !== undefined) route.departureTime = departureTime || null;
    if (arrivalTime !== undefined) route.arrivalTime = arrivalTime || null;
    if (operator !== undefined) route.operator = operator || null;
    if (active !== undefined) route.active = Boolean(active);

    await route.save();
    return res.status(200).json({ route });
  } catch (error) {
    return next(error);
  }
};

const deleteOwnerRoute = async (req, res, next) => {
  try {
    if (!req.user?.clientId) {
      return res.status(403).json({ message: 'Owner access required' });
    }

    const { id } = req.params;
    const route = await Route.findOneAndDelete({ _id: id, clientId: req.user.clientId });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    return res.status(200).json({ message: 'Route deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listPublicRoutes,
  listPublicCities,
  listOwnerRoutes,
  createOwnerRoute,
  updateOwnerRoute,
  deleteOwnerRoute
};
