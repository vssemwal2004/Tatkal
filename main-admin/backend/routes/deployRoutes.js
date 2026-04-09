const express = require('express');
const { deploySystem, listDeployments } = require('../controllers/deployController');

const router = express.Router();

router.get('/', listDeployments);
router.post('/', deploySystem);

module.exports = router;
