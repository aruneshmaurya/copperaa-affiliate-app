const Commission = require('../models/Commission');
const Referral = require('../models/Referral');

// @desc    Get affiliate dashboard stats
// @route   GET /api/affiliate/stats
// @access  Private/Affiliate
const getStats = async (req, res) => {
    try {
        const affiliateId = req.user._id;

        const totalClicks = await Referral.countDocuments({ affiliate: affiliateId });

        const commissions = await Commission.find({ affiliate: affiliateId });

        const totalOrders = commissions.length;

        const totalEarnings = commissions.reduce((acc, comm) => {
            return comm.status !== 'cancelled' ? acc + comm.commissionAmount : acc;
        }, 0);

        const unpaidEarnings = commissions.reduce((acc, comm) => {
            return comm.status === 'unpaid' ? acc + comm.commissionAmount : acc;
        }, 0);

        const paidEarnings = commissions.reduce((acc, comm) => {
            return comm.status === 'paid' ? acc + comm.commissionAmount : acc;
        }, 0);

        res.json({
            totalClicks,
            totalOrders,
            totalEarnings: totalEarnings.toFixed(2),
            unpaidEarnings: unpaidEarnings.toFixed(2),
            paidEarnings: paidEarnings.toFixed(2)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get affiliate commissions list
// @route   GET /api/affiliate/commissions
// @access  Private/Affiliate
const getAffiliateCommissions = async (req, res) => {
    try {
        const commissions = await Commission.find({ affiliate: req.user._id })
            .sort({ createdAt: -1 });

        res.json(commissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats,
    getAffiliateCommissions
};
