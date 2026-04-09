const express = require('express');
const { lockSeat, confirmBooking, getHistory } = require('../controllers/bookingController');

const router = express.Router();

router.post('/lock', lockSeat);
router.post('/confirm', confirmBooking);
router.get('/history', getHistory);

module.exports = router;
