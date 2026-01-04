const express = require('express');
const router = express.Router();
const { trackReferral } = require('../controllers/referral.controller');

router.post('/track', trackReferral);

module.exports = router;
