const Booking = require('../models/Booking');
const SeatLock = require('../models/SeatLock');
const Payment = require('../models/Payment');
const { ensureClientAccess } = require('../utils/clientAccess');

const lockSeat = async (req, res, next) => {
  try {
    const { clientId, routeId, seatId, holdMinutes = 10 } = req.body;

    if (!clientId || !routeId || !seatId) {
      return res.status(400).json({ message: 'clientId, routeId, and seatId are required' });
    }

    const accessibleClient = await ensureClientAccess(req, res, clientId);
    if (!accessibleClient) {
      return null;
    }

    const now = new Date();
    await SeatLock.deleteMany({
      clientId,
      routeId,
      seatId,
      status: 'locked',
      expiresAt: { $lte: now }
    });

    const alreadyBooked = await Booking.findOne({
      clientId,
      routeId,
      seatId,
      status: 'confirmed'
    }).lean();

    if (alreadyBooked) {
      return res.status(409).json({ message: 'Seat already booked' });
    }
    const existing = await SeatLock.findOne({
      clientId,
      routeId,
      seatId,
      status: 'locked',
      expiresAt: { $gt: now }
    }).lean();

    if (existing) {
      return res.status(409).json({ message: 'Seat already locked' });
    }

    const expiresAt = new Date(Date.now() + Number(holdMinutes) * 60 * 1000);
    let lock;
    try {
      lock = await SeatLock.create({
        clientId,
        routeId,
        seatId,
        userId: req.user.id,
        expiresAt
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Seat already locked' });
      }
      throw error;
    }

    return res.status(200).json({
      message: 'Seat locked',
      lockId: lock._id,
      expiresAt
    });
  } catch (error) {
    return next(error);
  }
};

const confirmBooking = async (req, res, next) => {
  try {
    const { lockId, amount = 0, currency = 'INR', payment } = req.body;

    if (!lockId) {
      return res.status(400).json({ message: 'lockId is required' });
    }

    const lock = await SeatLock.findById(lockId);
    if (!lock) {
      return res.status(404).json({ message: 'Seat lock not found' });
    }

    const accessibleClient = await ensureClientAccess(req, res, lock.clientId);
    if (!accessibleClient) {
      return null;
    }

    if (lock.expiresAt <= new Date()) {
      lock.status = 'expired';
      await lock.save();
      return res.status(400).json({ message: 'Seat lock expired' });
    }

    if (lock.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this seat lock' });
    }

    const alreadyBooked = await Booking.findOne({
      clientId: lock.clientId,
      routeId: lock.routeId,
      seatId: lock.seatId,
      status: 'confirmed'
    }).lean();

    if (alreadyBooked) {
      return res.status(409).json({ message: 'Seat already booked' });
    }

    if (payment?.orderId) {
      const paymentRecord = await Payment.findOne({ orderId: payment.orderId }).lean();
      if (!paymentRecord || paymentRecord.status !== 'verified') {
        return res.status(400).json({ message: 'Payment is not verified' });
      }
    }

    lock.status = 'confirmed';
    await lock.save();

    const booking = await Booking.create({
      clientId: lock.clientId,
      routeId: lock.routeId,
      seatId: lock.seatId,
      userId: lock.userId,
      amount,
      currency,
      payment: {
        orderId: payment?.orderId || null,
        paymentId: payment?.paymentId || null
      }
    });

    return res.status(201).json({
      message: 'Booking confirmed',
      bookingId: booking._id
    });
  } catch (error) {
    return next(error);
  }
};

const releaseSeatLock = async (req, res, next) => {
  try {
    const { lockId } = req.body;

    if (!lockId) {
      return res.status(400).json({ message: 'lockId is required' });
    }

    const lock = await SeatLock.findById(lockId);
    if (!lock) {
      return res.status(404).json({ message: 'Seat lock not found' });
    }

    const accessibleClient = await ensureClientAccess(req, res, lock.clientId);
    if (!accessibleClient) {
      return null;
    }

    if (lock.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this seat lock' });
    }

    if (lock.status === 'confirmed') {
      return res.status(409).json({ message: 'Seat lock already confirmed' });
    }

    if (lock.status === 'expired' || lock.expiresAt <= new Date()) {
      if (lock.status !== 'expired') {
        lock.status = 'expired';
        await lock.save();
      }
      return res.status(200).json({ message: 'Seat lock expired' });
    }

    lock.status = 'expired';
    await lock.save();

    return res.status(200).json({ message: 'Seat lock released' });
  } catch (error) {
    return next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const clientId = req.query.clientId || req.user.clientId;
    const filter = { userId: req.user.id };

    if (clientId) {
      const accessibleClient = await ensureClientAccess(req, res, clientId);
      if (!accessibleClient) {
        return null;
      }

      filter.clientId = clientId;
    }

    const items = await Booking.find(filter).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      items: items.map((item) => ({
        id: item._id,
        clientId: item.clientId,
        routeId: item.routeId,
        seatId: item.seatId,
        amount: item.amount,
        currency: item.currency,
        status: item.status,
        createdAt: item.createdAt,
        summary: `${item.routeId} - ${item.seatId}`
      }))
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  lockSeat,
  confirmBooking,
  releaseSeatLock,
  getHistory
};
