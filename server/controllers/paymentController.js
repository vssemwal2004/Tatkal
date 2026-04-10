const crypto = require('crypto');
const Razorpay = require('razorpay');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const SeatLock = require('../models/SeatLock');
const { ensureClientActive } = require('../utils/clientAccess');

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

const createOrder = async (req, res, next) => {
  try {
    const { amount, lockId } = req.body;

    if (!amount || !lockId) {
      return res.status(400).json({ message: 'amount and lockId are required' });
    }

    const lock = await SeatLock.findById(lockId);
    if (!lock) {
      return res.status(404).json({ message: 'Seat lock not found' });
    }

    const accessibleClient = await ensureClientActive(req, res, lock.clientId);
    if (!accessibleClient) {
      return null;
    }

    if (lock.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this seat lock' });
    }

    if (lock.status !== 'locked' || lock.expiresAt <= new Date()) {
      return res.status(400).json({ message: 'Seat lock expired' });
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

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res.status(501).json({ message: 'Razorpay keys are not configured on the server.' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });

    await Payment.create({
      clientId: lock.clientId,
      userId: req.user.id,
      amount: Number(amount),
      currency: 'INR',
      orderId: order.id,
      status: 'created',
      lockId: lock._id,
      routeId: lock.routeId,
      seatId: lock.seatId
    });

    return res.status(200).json({
      message: 'Payment order created',
      orderId: order.id,
      amount: Number(amount),
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    return next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: 'orderId, paymentId, and signature are required' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(501).json({ message: 'Razorpay keys are not configured on the server.' });
    }

    const expected = crypto.createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex');
    if (expected !== signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const existing = await Payment.findOne({ orderId }).lean();
    if (!existing) {
      return res.status(404).json({ message: 'Payment order not found' });
    }

    const accessibleClient = await ensureClientActive(req, res, existing.clientId);
    if (!accessibleClient) {
      return null;
    }

    if (req.user?.role !== 'admin' && existing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have access to this payment order' });
    }

    if (existing.status === 'verified') {
      return res.status(409).json({ message: 'Payment already verified' });
    }

    await Payment.updateOne(
      { orderId },
      {
        $set: {
          paymentId,
          status: 'verified'
        }
      }
    );

    return res.status(200).json({
      message: 'Payment verified',
      orderId,
      paymentId
    });
  } catch (error) {
    return next(error);
  }
};

const markFailed = async (req, res, next) => {
  try {
    const { orderId, reason } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const existing = await Payment.findOne({ orderId }).lean();
    if (!existing) {
      return res.status(404).json({ message: 'Payment order not found' });
    }

    const accessibleClient = await ensureClientActive(req, res, existing.clientId);
    if (!accessibleClient) {
      return null;
    }

    if (req.user?.role !== 'admin' && existing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have access to this payment order' });
    }

    if (existing.status === 'verified') {
      return res.status(409).json({ message: 'Payment already verified' });
    }

    await Payment.updateOne(
      { orderId },
      {
        $set: {
          status: 'failed',
          failureReason: reason || null
        }
      }
    );

    if (existing.lockId) {
      await SeatLock.updateOne(
        { _id: existing.lockId, status: 'locked' },
        { $set: { status: 'expired' } }
      );
    }

    return res.status(200).json({
      message: 'Payment marked as failed',
      orderId
    });
  } catch (error) {
    return next(error);
  }
};

const handleWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(501).json({ message: 'Razorpay webhook secret is not configured.' });
    }

    const signature = req.headers['x-razorpay-signature'];
    const payload = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body || {});

    const expected = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');
    if (expected !== signature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const body = req.body instanceof Buffer ? JSON.parse(payload) : req.body;
    const event = body?.event;
    const paymentEntity = body?.payload?.payment?.entity || {};
    const orderId = paymentEntity?.order_id;
    const paymentId = paymentEntity?.id;

    if (!orderId) {
      return res.status(200).json({ status: 'ignored' });
    }

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(200).json({ status: 'ignored' });
    }

    if (event === 'payment.captured') {
      if (payment.status !== 'verified') {
        payment.status = 'verified';
        payment.paymentId = paymentId || payment.paymentId;
        await payment.save();
      }
      return res.status(200).json({ status: 'ok' });
    }

    if (event === 'payment.failed') {
      if (payment.status !== 'failed') {
        payment.status = 'failed';
        payment.failureReason = paymentEntity?.error_description || 'payment_failed';
        await payment.save();
      }

      if (payment.lockId) {
        await SeatLock.updateOne(
          { _id: payment.lockId, status: 'locked' },
          { $set: { status: 'expired' } }
        );
      }

      return res.status(200).json({ status: 'ok' });
    }

    return res.status(200).json({ status: 'ignored' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  handleWebhook,
  markFailed
};
