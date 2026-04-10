const express = require('express');
const { deleteClient, listClients, updateClientStatus } = require('../controllers/clientController');

const router = express.Router();

router.get('/clients', listClients);
router.patch('/clients/:clientId/status', updateClientStatus);
router.delete('/clients/:clientId', deleteClient);

module.exports = router;
