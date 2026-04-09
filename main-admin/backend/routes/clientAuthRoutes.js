const express = require('express');
const { loginClient, registerClient } = require('../controllers/clientAuthController');

const router = express.Router();

router.post('/register', registerClient);
router.post('/login', loginClient);

module.exports = router;
