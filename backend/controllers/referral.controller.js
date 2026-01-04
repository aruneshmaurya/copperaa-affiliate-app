const Affiliate = require('../models/Affiliate');
const Referral = require('../models/Referral');

// @desc    Track a referral click
// @route   POST /api/referrals/track
// @access  Public
const trackReferral = async (req, res) => {
    try {
        const { affiliateCode } = req.body;

        // Log basic info
        const userAgent = req.headers['user-agent'];
        // IP address (handling proxy like Nginx or Heroku)
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (!affiliateCode) {
            res.status(400);
            throw new Error('Affiliate code is required');
        }

        // Validate Affiliate (must exist and be approved)
        const affiliate = await Affiliate.findOne({ affiliateCode, approved: true });

        if (!affiliate) {
            // Silently fail to avoid leaking valid codes, or return 404.
            // Returning 404 is fine for analytics.
            return res.status(404).json({ message: 'Invalid or inactive affiliate code' });
        }

        // Record the referral
        await Referral.create({
            affiliate: affiliate._id,
            refCode: affiliateCode,
            ipAddress,
            userAgent
        });

        res.status(200).json({ status: 'success', message: 'Referral tracked' });

    } catch (error) {
        console.error('Track Error:', error.message);
        // Do not block UI on error
        res.status(500).json({ message: 'Tracking failed' });
    }
};

module.exports = { trackReferral };
