const express = require('express');
const { deploySystem, listDeployments } = require('../controllers/deployController');

const router = express.Router();

router.get('/deployments', listDeployments);
router.post('/deploy', deploySystem);

module.exports = router;
