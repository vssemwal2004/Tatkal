const express = require('express');
const { getFullBackendInfo } = require('../controllers/fullBackendController');

const router = express.Router();

router.get('/full-backend', getFullBackendInfo);

module.exports = router;
