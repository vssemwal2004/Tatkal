const Route = require('../models/Route');
const Booking = require('../models/Booking');
const SeatLock = require('../models/SeatLock');

const getClientIdFromRequest = (req) =>
  req.query.clientId || req.headers['x-client-id'] || '';

const buildScheduleFromRoute = (route, bookedCount = 0, lockedCount = 0) => {
  const totalSeats = route.totalSeats || 40;
  const availableSeats = Math.max(0, totalSeats - bookedCount - lockedCount);

  return {
    _id: route._id,
    route: {
      from: route.from,
      to: route.to,
      duration: null
    },
    fare: route.price,
    availableSeats,
    departureTime: route.departureTime || '07:00',
    arrivalTime: route.arrivalTime || '10:00',
    bus: {
      busName: route.operator || 'Tatkal Express',
      busNumber: String(route._id).slice(-6),
      busType: 'AC',
      totalSeats
    }
  };
};

const searchBuses = async (req, res, next) => {
  try {
    const clientId = getClientIdFromRequest(req);
    if (!clientId) {
      return res.status(400).json({ message: 'clientId is required' });
    }

    const { from, to } = req.query;
    const filter = { clientId, active: true };
    if (from) filter.from = from;
    if (to) filter.to = to;

    const routes = await Route.find(filter).lean();
    const routeIds = routes.map((route) => route._id.toString());

    const bookings = await Booking.find({ routeId: { $in: routeIds }, status: 'confirmed' }).lean();
    const locks = await SeatLock.find({ routeId: { $in: routeIds }, status: 'locked', expiresAt: { $gt: new Date() } }).lean();

    const bookedByRoute = bookings.reduce((acc, item) => {
      acc[item.routeId] = (acc[item.routeId] || 0) + 1;
      return acc;
    }, {});
    const lockedByRoute = locks.reduce((acc, item) => {
      acc[item.routeId] = (acc[item.routeId] || 0) + 1;
      return acc;
    }, {});

    const schedules = routes.map((route) =>
      buildScheduleFromRoute(route, bookedByRoute[route._id.toString()] || 0, lockedByRoute[route._id.toString()] || 0)
    );

    return res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    return next(error);
  }
};

const getBusSeats = async (req, res, next) => {
  try {
    const clientId = getClientIdFromRequest(req);
    if (!clientId) {
      return res.status(400).json({ message: 'clientId is required' });
    }

    const { scheduleId } = req.params;
    const route = await Route.findOne({ _id: scheduleId, clientId }).lean();
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const bookedItems = await Booking.find({ routeId: String(route._id), status: 'confirmed' }).lean();
    const lockItems = await SeatLock.find({
      routeId: String(route._id),
      status: 'locked',
      expiresAt: { $gt: new Date() }
    }).lean();

    const bookedSeats = bookedItems.map((item) => item.seatId);
    const lockedSeats = lockItems.map((item) => ({ seatNumber: item.seatId }));

    const schedule = buildScheduleFromRoute(route, bookedSeats.length, lockedSeats.length);

    return res.status(200).json({
      success: true,
      data: {
        schedule,
        seatLayout: { totalSeats: schedule.bus.totalSeats },
        bookedSeats,
        lockedSeats,
        availableSeats: schedule.availableSeats
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  searchBuses,
  getBusSeats
};
