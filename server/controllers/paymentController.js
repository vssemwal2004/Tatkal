const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');

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
    const { amount, clientId } = req.body;

    if (!amount || !clientId) {
      return res.status(400).json({ message: 'amount and clientId are required' });
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
      clientId,
      userId: req.user.id,
      amount: Number(amount),
      currency: 'INR',
      orderId: order.id,
      status: 'created'
    });

    return res.status(200).json({
      message: 'Payment order created',
      orderId: order.id,
      amount: Number(amount),
      currency: 'INR'
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

module.exports = {
  createOrder,
  verifyPayment
};
