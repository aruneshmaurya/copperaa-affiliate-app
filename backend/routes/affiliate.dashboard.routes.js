const express = require('express');
const router = express.Router();
const { getStats, getAffiliateCommissions, updatePaymentSettings } = require('../controllers/affiliate.dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes here are for affiliates
router.use(protect); // Ensure logged in
// We don't need 'admin' middleware, but we should strictly ensure user is not admin if we want separate logic, or just let both view data?
// Ideally, admin shouldn't be using this route, they have admin routes. But no harm if they do, except they have no referral data usually.
// Strict 'affiliate' role check optional but 'protect' is mandatory.

router.get('/stats', getStats);
router.get('/commissions', getAffiliateCommissions);
router.put('/payment', updatePaymentSettings);

module.exports = router;
