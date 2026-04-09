const express = require('express');
const { getClientStatus } = require('../controllers/clientPortalController');

const router = express.Router();

router.get('/status/:clientId', getClientStatus);

module.exports = router;
