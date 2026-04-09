const express = require('express');
const {
  saveDesignDraft,
  submitDesign,
  trackDesign
} = require('../controllers/designController');

const router = express.Router();

router.post('/save', saveDesignDraft);
router.post('/submit', submitDesign);
router.get('/track/:clientId', trackDesign);

module.exports = router;
