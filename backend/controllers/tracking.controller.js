const Referral = require('../models/Referral');
const Affiliate = require('../models/Affiliate');

// @desc    Track an affiliate click
// @route   POST /api/track/click
// @access  Public
const trackClick = async (req, res) => {
    try {
        const { affiliateCode, ipAddress, userAgent } = req.body;

        if (!affiliateCode) {
            return res.status(400).json({ message: 'Affiliate code required' });
        }

        const affiliate = await Affiliate.findOne({ affiliateCode });

        if (!affiliate) {
            return res.status(404).json({ message: 'Affiliate not found' });
        }

        // Basic duplicate check: Prevent multiple clicks from same IP within 1 hour ?
        // For MVP, simplistic tracking: Just simple check if recently clicked (1 minute debounce)
        const recentClick = await Referral.findOne({
            affiliate: affiliate._id,
            ipAddress,
            createdAt: { $gt: new Date(Date.now() - 60 * 1000) } // 1 minute ago
        });

        if (recentClick) {
            return res.status(200).json({ message: 'Click already recorded' });
        }

        await Referral.create({
            affiliate: affiliate._id,
            refCode: affiliateCode,
            ipAddress,
            userAgent
        });

        res.status(200).json({ message: 'Click tracked' });

    } catch (error) {
        console.error('Tracking Error:', error);
        res.status(500).json({ message: 'Tracking failed' });
    }
};

module.exports = { trackClick };
