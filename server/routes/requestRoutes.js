const express = require('express');
const {
  getAllRequests,
  getRequestByClientId,
  approveRequest,
  getDashboardStats
} = require('../controllers/requestController');
const { exportClientZip } = require('../controllers/exportController');

const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.get('/requests', getAllRequests);
router.get('/request/:clientId', getRequestByClientId);
router.patch('/request/:clientId/approve', approveRequest);
router.post('/export/:clientId', exportClientZip);

module.exports = router;
