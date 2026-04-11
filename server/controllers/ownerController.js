const Booking = require('../models/Booking');
const User = require('../models/User');

const getClientBookings = async (req, res, next) => {
  try {
    if (!req.user?.clientId) {
      return res.status(403).json({ message: 'Owner access required' });
    }

    const items = await Booking.find({ clientId: req.user.clientId })
      .sort({ createdAt: -1 })
      .lean();

    const userIds = [...new Set(items.map((item) => item.userId?.toString()).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } })
      .select('email name')
      .lean();
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    return res.status(200).json({
      items: items.map((item) => ({
        id: item._id,
        routeId: item.routeId,
        seatId: item.seatId,
        amount: item.amount,
        currency: item.currency,
        status: item.status,
        createdAt: item.createdAt,
        user: userMap[item.userId?.toString()] || null,
        payment: item.payment || {}
      }))
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getClientBookings
};
