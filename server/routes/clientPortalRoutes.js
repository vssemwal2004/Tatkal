const express = require('express');
const { getClientStatus } = require('../controllers/clientPortalController');
const { getFullBackendInfo, getFullBackendStatus } = require('../controllers/fullBackendController');

const router = express.Router();

router.get('/status/:clientId', getClientStatus);
router.get('/full-backend', getFullBackendInfo);
router.get('/full-backend/status', getFullBackendStatus);

module.exports = router;
