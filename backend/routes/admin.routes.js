const express = require('express');
const router = express.Router();
const {
    getAffiliates,
    approveAffiliate,
    disableAffiliate,
    updateCommission
} = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');

const {
    getCommissions,
    approveCommission,
    markCommissionPaid
} = require('../controllers/admin.commissions.controller');

const { validateObjectId } = require('../middleware/validateObjectId');

// All routes are protected and require admin role
router.use(protect);
router.use(admin);

router.get('/affiliates', getAffiliates);
router.patch('/affiliates/:id/approve', validateObjectId, approveAffiliate);
router.patch('/affiliates/:id/disable', validateObjectId, disableAffiliate);
router.patch('/affiliates/:id/commission', validateObjectId, updateCommission);

// Commission Routes
router.get('/commissions', getCommissions);
router.patch('/commissions/:id/approve', validateObjectId, approveCommission);
router.patch('/commissions/:id/pay', validateObjectId, markCommissionPaid);

module.exports = router;
