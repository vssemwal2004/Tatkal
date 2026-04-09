const express = require('express');
const { getDesignByClientId, saveDesign } = require('../controllers/designController');

const router = express.Router();

router.post('/save', saveDesign);
router.get('/:clientId', getDesignByClientId);

module.exports = router;
