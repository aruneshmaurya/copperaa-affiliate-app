const Commission = require('../models/Commission');
const { verifyWebhook } = require('../utils/verifyWebhook');

// @desc    Handle Shopify Refund Create
// @route   POST /api/webhooks/refunds/create
const handleRefundCreate = async (req, res) => {
    try {
        // Validate HMAC
        if (!verifyWebhook(req)) {
            return res.status(401).send('Unauthorized');
        }

        const refund = req.body;
        const orderId = refund.order_id.toString();

        console.log(`Refund Created Webhook for Order: ${orderId}`);

        // Handle full refunds or partial? 
        // Requirement says: "Refund created -> Mark commission as 'reversed'"
        // It implies if any refund happens, reverse it? Or check amounts?
        // Prompt simplistic rule: "Mark commission as revered". We will follow simplified rule.

        const commission = await Commission.findOne({ orderId: orderId });

        if (commission) {
            // Check if already reversed to avoid redundant writes
            if (commission.status !== 'reversed') {
                commission.status = 'reversed';
                await commission.save();
                console.log(`Commission reversed for order ${orderId} due to refund`);
            }
        } else {
            console.log(`No commission found for refunded order ${orderId}`);
        }

        res.status(200).send('Processed');
    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { handleRefundCreate };
