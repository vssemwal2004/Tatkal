const express = require('express');
const {
  reserveSeat,
  createOrder,
  confirmBooking,
  releaseSeat,
  getMyBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingCompatController');

const router = express.Router();

router.post('/reserve', reserveSeat);
router.post('/create-order', createOrder);
router.post('/confirm', confirmBooking);
router.post('/release', releaseSeat);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
