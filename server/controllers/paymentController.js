const createOrder = async (req, res, next) => {
  try {
    const { amount, clientId } = req.body;

    if (!amount || !clientId) {
      return res.status(400).json({ message: 'amount and clientId are required' });
    }

    const orderId = `order_${Date.now()}`;

    return res.status(200).json({
      message: 'Payment order created',
      orderId,
      amount,
      currency: 'INR'
    });
  } catch (error) {
    return next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId } = req.body;

    if (!orderId || !paymentId) {
      return res.status(400).json({ message: 'orderId and paymentId are required' });
    }

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
