const Affiliate = require('../models/Affiliate');

// @desc    Get all affiliates
// @route   GET /api/admin/affiliates
// @access  Private/Admin
const getAffiliates = async (req, res) => {
    try {
        const { approved } = req.query;
        let query = { role: 'affiliate' };

        // Filter by approval status if provided
        if (approved !== undefined) {
            query.approved = approved === 'true';
        }

        const affiliates = await Affiliate.find(query)
            .select('-password') // Exclude password
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json(affiliates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve an affiliate
// @route   PATCH /api/admin/affiliates/:id/approve
// @access  Private/Admin
const approveAffiliate = async (req, res) => {
    try {
        const affiliate = await Affiliate.findById(req.params.id);

        if (!affiliate) {
            res.status(404);
            throw new Error('Affiliate not found');
        }

        affiliate.approved = true;
        const updatedAffiliate = await affiliate.save();

        res.status(200).json({
            _id: updatedAffiliate._id,
            name: updatedAffiliate.name,
            email: updatedAffiliate.email,
            approved: updatedAffiliate.approved,
            message: 'Affiliate approved successfully'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Disable an affiliate
// @route   PATCH /api/admin/affiliates/:id/disable
// @access  Private/Admin
const disableAffiliate = async (req, res) => {
    try {
        const affiliate = await Affiliate.findById(req.params.id);

        if (!affiliate) {
            res.status(404);
            throw new Error('Affiliate not found');
        }

        affiliate.approved = false;
        const updatedAffiliate = await affiliate.save();

        res.status(200).json({
            _id: updatedAffiliate._id,
            name: updatedAffiliate.name,
            email: updatedAffiliate.email,
            approved: updatedAffiliate.approved,
            message: 'Affiliate disabled successfully'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Update affiliate commission rate
// @route   PATCH /api/admin/affiliates/:id/commission
// @access  Private/Admin
const updateCommission = async (req, res) => {
    try {
        const { commissionRate } = req.body;

        if (commissionRate === undefined || commissionRate < 0 || commissionRate > 100) {
            res.status(400);
            throw new Error('Please provide a valid commission rate (0-100)');
        }

        const affiliate = await Affiliate.findById(req.params.id);

        if (!affiliate) {
            res.status(404);
            throw new Error('Affiliate not found');
        }

        affiliate.commissionRate = commissionRate;
        const updatedAffiliate = await affiliate.save();

        res.status(200).json({
            _id: updatedAffiliate._id,
            name: updatedAffiliate.name,
            commissionRate: updatedAffiliate.commissionRate,
            message: `Commission rate updated to ${commissionRate}%`
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Delete an affiliate
// @route   DELETE /api/admin/affiliates/:id
// @access  Private/Admin
const deleteAffiliate = async (req, res) => {
    try {
        const affiliate = await Affiliate.findById(req.params.id);

        if (!affiliate) {
            res.status(404);
            throw new Error('Affiliate not found');
        }

        await Affiliate.deleteOne({ _id: affiliate._id });

        res.status(200).json({ message: 'Affiliate removed' });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

module.exports = {
    getAffiliates,
    approveAffiliate,
    disableAffiliate,
    updateCommission,
    deleteAffiliate
};
