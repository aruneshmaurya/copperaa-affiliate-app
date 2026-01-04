const Commission = require('../models/Commission');
const { verifyWebhook } = require('../utils/verifyWebhook');

// @desc    Handle Shopify Order Cancelled Webhook
// @route   POST /api/webhooks/orders/cancelled
// @access  Public (Verified by HMAC)
const handleOrderCancel = async (req, res) => {
    try {
        // 1. Verify HMAC
        if (!verifyWebhook(req)) {
            console.error('Webhook verification failed');
            return res.status(401).send('Unauthorized');
        }

        const order = req.body;
        console.log(`Received Webhook: Order Cancelled ${order.id}`);

        // 2. Find Commission
        const commission = await Commission.findOne({ orderId: order.id.toString() });

        if (!commission) {
            console.log(`No commission found for cancelled order ${order.id}`);
            return res.status(200).send('No commission found');
        }

        // 3. Mark as Cancelled
        if (commission.status !== 'cancelled') {
            commission.status = 'cancelled';
            commission.previousAmount = commission.commissionAmount; // Optional: store history if schema allows, otherwise just overwrite
            commission.commissionAmount = 0; // Set to 0 because order is void
            await commission.save();
            console.log(`Commission cancelled for order ${order.id}`);
        } else {
            console.log(`Commission already cancelled for order ${order.id}`);
        }

        res.status(200).send('Order cancellation processed');

    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { handleOrderCancel };
