const express = require('express');
const {
  listOwnerRoutes,
  createOwnerRoute,
  updateOwnerRoute,
  deleteOwnerRoute
} = require('../controllers/routeController');
const { getClientBookings } = require('../controllers/ownerController');

const router = express.Router();

router.get('/routes', listOwnerRoutes);
router.post('/routes', createOwnerRoute);
router.put('/routes/:id', updateOwnerRoute);
router.delete('/routes/:id', deleteOwnerRoute);
router.get('/bookings', getClientBookings);

module.exports = router;
