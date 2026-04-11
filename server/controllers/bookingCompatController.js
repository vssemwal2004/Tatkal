const crypto = require('crypto');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Route = require('../models/Route');
const SeatLock = require('../models/SeatLock');
const { ensureClientActive } = require('../utils/clientAccess');
const { acquireLock, releaseLock } = require('../utils/redisLock');
const { sendBookingConfirmation } = require('../utils/mailer');

const getClientIdFromRequest = (req) =>
  req.query.clientId || req.headers['x-client-id'] || '';

const reserveSeat = async (req, res, next) => {
  try {
    const { scheduleId, seatNumber, holdMinutes = 2 } = req.body;
    const clientId = getClientIdFromRequest(req);

    if (!clientId || !scheduleId || seatNumber == null) {
      return res.status(400).json({ message: 'clientId, scheduleId, and seatNumber are required' });
    }

    const accessibleClient = await ensureClientActive(req, res, clientId);
    if (!accessibleClient) return null;

    const route = await Route.findOne({ _id: scheduleId, clientId }).lean();
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const seatId = String(seatNumber);
    const lockKey = `seatlock:${clientId}:${route._id}:${seatId}`;
    const lockToken = await acquireLock(lockKey, 5000);
    if (!lockToken) {
      return res.status(409).json({ message: 'Seat already locked' });
    }

    try {
      const now = new Date();
      await SeatLock.deleteMany({
        clientId,
        routeId: String(route._id),
        seatId,
        status: 'locked',
        expiresAt: { $lte: now }
      });

      const alreadyBooked = await Booking.findOne({
        clientId,
        routeId: String(route._id),
        seatId,
        status: 'confirmed'
      }).lean();

      if (alreadyBooked) {
        return res.status(409).json({ message: 'Seat already booked' });
      }

      const existing = await SeatLock.findOne({
        clientId,
        routeId: String(route._id),
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
          routeId: String(route._id),
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
        reservationToken: lock._id,
        expiresAt,
        seatNumber: seatId,
        scheduleId
      });
    } finally {
      await releaseLock(lockKey, lockToken);
    }
  } catch (error) {
    return next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { reservationToken } = req.body;
    if (!reservationToken) {
      return res.status(400).json({ message: 'reservationToken is required' });
    }

    const lock = await SeatLock.findById(reservationToken);
    if (!lock) {
      return res.status(404).json({ message: 'Seat lock not found' });
    }

    const accessibleClient = await ensureClientActive(req, res, lock.clientId);
    if (!accessibleClient) return null;

    if (lock.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this seat lock' });
    }

    if (lock.status !== 'locked' || lock.expiresAt <= new Date()) {
      return res.status(400).json({ message: 'Seat lock expired' });
    }

    const route = await Route.findOne({ _id: lock.routeId, clientId: lock.clientId }).lean();
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const existingPayment = await Payment.findOne({
      lockId: lock._id,
      status: { $in: ['created', 'verified'] }
    }).lean();

    if (existingPayment) {
      if (existingPayment.status === 'verified') {
        return res.status(409).json({ message: 'Payment already verified', orderId: existingPayment.orderId });
      }

      return res.status(200).json({
        orderId: existingPayment.orderId,
        amount: Number(existingPayment.amount || 0) * 100,
        currency: existingPayment.currency || 'INR',
        keyId
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return res.status(501).json({ message: 'Razorpay keys are not configured on the server.' });
    }

    const paymentLockKey = `paymentlock:${lock._id}`;
    const paymentToken = await acquireLock(paymentLockKey, 5000);
    if (!paymentToken) {
      return res.status(409).json({ message: 'Payment is already in progress' });
    }

    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    try {
      const order = await razorpay.orders.create({
        amount: Math.round(Number(route.price || 0) * 100),
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`
      });

      try {
        await Payment.create({
          clientId: lock.clientId,
          userId: req.user.id,
          amount: Number(route.price || 0),
          currency: 'INR',
          orderId: order.id,
          status: 'created',
          lockId: lock._id,
          routeId: lock.routeId,
          seatId: lock.seatId
        });
      } catch (error) {
        if (error.code === 11000) {
          const existing = await Payment.findOne({
            lockId: lock._id,
            status: { $in: ['created', 'verified'] }
          }).lean();
          if (existing) {
            return res.status(200).json({
              orderId: existing.orderId,
              amount: Number(existing.amount || 0) * 100,
              currency: existing.currency || 'INR',
              keyId
            });
          }
        }
        throw error;
      }

      return res.status(200).json({
        orderId: order.id,
        amount: Number(route.price || 0) * 100,
        currency: 'INR',
        keyId
      });
    } finally {
      await releaseLock(paymentLockKey, paymentToken);
    }
  } catch (error) {
    return next(error);
  }
};

const confirmBooking = async (req, res, next) => {
  try {
    const { reservationToken, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!reservationToken || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment details are required' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(501).json({ message: 'Razorpay keys are not configured on the server.' });
    }

    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const lock = await SeatLock.findById(reservationToken);
    if (!lock) {
      return res.status(404).json({ message: 'Seat lock not found' });
    }

    const accessibleClient = await ensureClientActive(req, res, lock.clientId);
    if (!accessibleClient) return null;

    if (lock.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this seat lock' });
    }

    if (lock.expiresAt <= new Date()) {
      lock.status = 'expired';
      await lock.save();
      return res.status(400).json({ message: 'Seat lock expired' });
    }

    const alreadyBooked = await Booking.findOne({
      clientId: lock.clientId,
      routeId: lock.routeId,
      seatId: lock.seatId,
      status: 'confirmed'
    }).lean();

    if (alreadyBooked) {
      lock.status = 'expired';
      await lock.save();
      return res.status(409).json({ message: 'Seat already booked' });
    }

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (payment && payment.status !== 'verified') {
      payment.status = 'verified';
      payment.paymentId = razorpay_payment_id;
      await payment.save();
    }

    const route = await Route.findOne({ _id: lock.routeId, clientId: lock.clientId }).lean();

    const confirmedLock = await SeatLock.findOneAndUpdate(
      { _id: reservationToken, status: 'locked', userId: req.user.id, expiresAt: { $gt: new Date() } },
      { $set: { status: 'confirmed' } },
      { new: true }
    );

    if (!confirmedLock) {
      return res.status(409).json({ message: 'Seat lock is not available' });
    }

    let booking;
    try {
      booking = await Booking.create({
        clientId: confirmedLock.clientId,
        routeId: confirmedLock.routeId,
        seatId: confirmedLock.seatId,
        userId: confirmedLock.userId,
        amount: payment?.amount || 0,
        currency: payment?.currency || 'INR',
        payment: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        await SeatLock.updateOne({ _id: confirmedLock._id }, { $set: { status: 'expired' } });
        return res.status(409).json({ message: 'Seat already booked' });
      }
      throw error;
    }

    const response = {
      booking: { bookingId: booking._id },
      hackwowBookingId: booking._id
    };

    try {
      const routeLabel = route ? `${route.from} → ${route.to}` : `${confirmedLock.routeId}`;
      const recipient = req.user?.email;
      await sendBookingConfirmation({
        to: recipient,
        booking,
        routeLabel,
        seatLabel: confirmedLock.seatId
      });
    } catch (mailError) {
      console.error('Booking confirmation email failed:', mailError?.message || mailError);
    }

    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
};

const releaseSeat = async (req, res, next) => {
  try {
    const { reservationToken } = req.body;
    if (!reservationToken) {
      return res.status(400).json({ message: 'reservationToken is required' });
    }

    const lock = await SeatLock.findById(reservationToken);
    if (!lock) {
      return res.status(404).json({ message: 'Seat lock not found' });
    }

    const accessibleClient = await ensureClientActive(req, res, lock.clientId);
    if (!accessibleClient) return null;

    if (lock.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this seat lock' });
    }

    if (lock.status !== 'confirmed') {
      lock.status = 'expired';
      await lock.save();
    }

    return res.status(200).json({ message: 'Seat lock released' });
  } catch (error) {
    return next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const items = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ bookings: items });
  } catch (error) {
    return next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking || booking.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json(booking);
  } catch (error) {
    return next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'cancelled';
    await booking.save();
    return res.status(200).json({ message: 'Booking cancelled' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  reserveSeat,
  createOrder,
  confirmBooking,
  releaseSeat,
  getMyBookings,
  getBookingById,
  cancelBooking
};
