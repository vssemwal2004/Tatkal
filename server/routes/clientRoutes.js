const express = require('express');
const { listClients } = require('../controllers/clientController');

const router = express.Router();

router.get('/clients', listClients);

module.exports = router;
