const Commission = require('../models/Commission');
const Referral = require('../models/Referral');
const Affiliate = require('../models/Affiliate');

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
            return comm.status !== 'reversed' && comm.status !== 'cancelled' ? acc + comm.commissionAmount : acc;
        }, 0);

        const unpaidEarnings = commissions.reduce((acc, comm) => {
            return comm.status === 'pending' || comm.status === 'unpaid' ? acc + comm.commissionAmount : acc;
        }, 0);

        const paidEarnings = commissions.reduce((acc, comm) => {
            return comm.status === 'approved' || comm.status === 'paid' ? acc + comm.commissionAmount : acc;
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

// @desc    Update payment method
// @route   PUT /api/affiliate/payment
// @access  Private/Affiliate
const updatePaymentSettings = async (req, res) => {
    try {
        const { method, paypalEmail, bankDetails } = req.body;

        const affiliate = await Affiliate.findById(req.user._id);

        if (!affiliate) {
            return res.status(404).json({ message: 'Affiliate not found' });
        }

        // Validate
        if (method === 'paypal') {
            if (!paypalEmail) {
                return res.status(400).json({ message: 'PayPal email is required' });
            }
            // Basic email regex check
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(paypalEmail)) {
                return res.status(400).json({ message: 'Invalid PayPal Email' });
            }

            // Set data
            affiliate.payoutSettings.method = 'paypal';
            affiliate.payoutSettings.paypalEmail = paypalEmail;

        } else if (method === 'bank') {
            if (!bankDetails ||
                !bankDetails.accountHolderName ||
                !bankDetails.bankName ||
                !bankDetails.accountNumber ||
                !bankDetails.ifscOrRouting ||
                !bankDetails.country) {
                return res.status(400).json({ message: 'All Bank Details fields are required' });
            }

            affiliate.payoutSettings.method = 'bank';
            affiliate.payoutSettings.bankDetails = {
                accountHolderName: bankDetails.accountHolderName,
                bankName: bankDetails.bankName,
                accountNumber: bankDetails.accountNumber,
                ifscOrRouting: bankDetails.ifscOrRouting,
                swiftOrIban: bankDetails.swiftOrIban || '',
                country: bankDetails.country
            };
        } else {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        await affiliate.save();

        res.json({
            message: 'Payout settings saved successfully',
            payoutSettings: affiliate.payoutSettings
        });

    } catch (error) {
        console.error('Update Payment Error:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

module.exports = {
    getStats,
    getAffiliateCommissions,
    updatePaymentSettings
};
