const express = require('express');
const { listPublicRoutes, listPublicCities } = require('../controllers/routeController');

const router = express.Router();

router.get('/', listPublicRoutes);
router.get('/cities', listPublicCities);

module.exports = router;
