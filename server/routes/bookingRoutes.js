const express = require('express');
const { lockSeat, confirmBooking, releaseSeatLock, getHistory } = require('../controllers/bookingController');

const router = express.Router();

router.post('/lock', lockSeat);
router.post('/confirm', confirmBooking);
router.post('/release', releaseSeatLock);
router.get('/history', getHistory);

module.exports = router;
