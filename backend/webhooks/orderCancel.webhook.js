const Commission = require('../models/Commission');
const { verifyWebhook } = require('../utils/verifyWebhook');

// @desc    Handle Shopify Order Cancelled
// @route   POST /api/webhooks/orders/cancelled
const handleOrderCancel = async (req, res) => {
    try {
        // Validate HMAC
        if (!verifyWebhook(req)) {
            return res.status(401).send('Unauthorized');
        }

        const order = req.body;
        console.log(`Order Cancelled Webhook: ${order.id}`);

        // Find commission -> Mark reversed
        const commission = await Commission.findOne({ orderId: order.id.toString() });

        if (commission) {
            commission.status = 'reversed';
            await commission.save();
            console.log(`Commission reversed for order ${order.id}`);
        } else {
            console.log(`No commission found for cancelled order ${order.id}`);
        }

        res.status(200).send('Processed');
    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { handleOrderCancel };
