const express = require('express');
const { deleteClient, listClients, updateClientStatus, updateFullBackendAccess } = require('../controllers/clientController');

const router = express.Router();

router.get('/clients', listClients);
router.patch('/clients/:clientId/status', updateClientStatus);
router.patch('/clients/:clientId/full-backend', updateFullBackendAccess);
router.delete('/clients/:clientId', deleteClient);

module.exports = router;
