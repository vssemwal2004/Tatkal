const express = require('express');
const { getFullBackendInfo, getFullBackendStatus } = require('../controllers/fullBackendController');

const router = express.Router();

router.get('/full-backend', getFullBackendInfo);
router.get('/full-backend/status', getFullBackendStatus);

module.exports = router;
