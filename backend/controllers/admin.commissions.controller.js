const Commission = require('../models/Commission');

// ... existing code ...

// @desc    Get all commissions
// @route   GET /api/admin/commissions
// @access  Private/Admin
const getCommissions = async (req, res) => {
    try {
        const commissions = await Commission.find({})
            .populate('affiliate', 'name email affiliateCode payoutSettings')
            .sort({ createdAt: -1 });

        res.status(200).json(commissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve commission (ready for payout)
// @route   PATCH /api/admin/commissions/:id/approve
// @access  Private/Admin
const approveCommission = async (req, res) => {
    try {
        const commission = await Commission.findById(req.params.id);

        if (!commission) {
            res.status(404);
            throw new Error('Commission not found');
        }

        commission.status = 'approved';
        const updatedCommission = await commission.save();

        res.status(200).json(updatedCommission);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Mark commission as paid
// @route   PATCH /api/admin/commissions/:id/pay
// @access  Private/Admin
const markCommissionPaid = async (req, res) => {
    try {
        const commission = await Commission.findById(req.params.id);

        if (!commission) {
            res.status(404);
            throw new Error('Commission not found');
        }

        commission.status = 'paid'; // Or 'approved' -> 'paid' flow
        const updatedCommission = await commission.save();

        res.status(200).json(updatedCommission);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

module.exports = {
    getCommissions,
    approveCommission,
    markCommissionPaid
};
