const express = require('express');
const {
  getAllRequests,
  getRequestByClientId,
  approveRequest,
  getDashboardStats
} = require('../controllers/requestController');

const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.get('/requests', getAllRequests);
router.get('/request/:clientId', getRequestByClientId);
router.patch('/request/:clientId/approve', approveRequest);

module.exports = router;
