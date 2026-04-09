const express = require('express');
const {
  getPendingRequests,
  getRequestByClientId,
  approveRequest,
  getDashboardStats
} = require('../controllers/requestController');

const router = express.Router();

router.get('/stats/overview', getDashboardStats);
router.get('/', getPendingRequests);
router.get('/:clientId', getRequestByClientId);
router.patch('/:clientId/approve', approveRequest);

module.exports = router;
