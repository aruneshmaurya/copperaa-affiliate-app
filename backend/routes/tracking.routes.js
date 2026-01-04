const express = require('express');
const router = express.Router();
const { trackClick } = require('../controllers/tracking.controller');

router.post('/click', trackClick);

module.exports = router;
