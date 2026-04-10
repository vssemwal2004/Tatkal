const express = require('express');
const { createOrder, verifyPayment, markFailed } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/failed', markFailed);

module.exports = router;
