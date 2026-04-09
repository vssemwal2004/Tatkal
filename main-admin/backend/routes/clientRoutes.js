const express = require('express');
const { listClients } = require('../controllers/clientController');

const router = express.Router();

router.get('/', listClients);

module.exports = router;
