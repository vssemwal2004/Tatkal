const express = require('express');
const { searchBuses, getBusSeats } = require('../controllers/busController');

const router = express.Router();

router.get('/search', searchBuses);
router.get('/:scheduleId/seats', getBusSeats);

module.exports = router;
