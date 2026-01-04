const Affiliate = require('../models/Affiliate');
const Commission = require('../models/Commission');
const { verifyWebhook } = require('../utils/verifyWebhook');


// @desc    Handle Shopify Order Create Webhook
// @route   POST /api/webhooks/orders/create
// @access  Public (Verified by HMAC)
const handleOrderCreate = async (req, res) => {
    try {
        // 1. Verify HMAC
        if (!verifyWebhook(req)) {
            console.error('Webhook verification failed');
            return res.status(401).send('Unauthorized');
        }

        const order = req.body;
        console.log(`Received Webhook: Order ${order.id}`);

        // 2. Detect Affiliate
        let affiliateCode = null;

        // Check Note Attributes (Priority 1)
        if (order.note_attributes) {
            // Requirement: "Affiliate ID will be stored in: order.attributes.affiliate_id"
            const refAttr = order.note_attributes.find(attr => attr.name === 'affiliate_id');
            if (refAttr) {
                affiliateCode = refAttr.value;
            }
        }

        if (!affiliateCode) {
            console.log(`Order ${order.id} has no affiliate_id attribute.`);
            return res.status(200).send('No affiliate found');
        }

        // 3. Validate Affiliate
        const affiliate = await Affiliate.findOne({ affiliateCode, approved: true });

        if (!affiliate) {
            console.error(`Affiliate code ${affiliateCode} not found or not approved.`);
            return res.status(200).send('Invalid affiliate');
        }

        // 4. Check for Existing Commission
        const existingCommission = await Commission.findOne({ orderId: order.id.toString() });
        if (existingCommission) {
            console.log(`Commission already exists for order ${order.id}`);
            return res.status(200).send('Duplicate commission');
        }

        // 5. Calculate Commission
        // Commission base: order.subtotal_price (not tax, not shipping)
        const subtotal = parseFloat(order.subtotal_price);

        const commissionRate = 10; // Fixed 10% as per requirements, or use affiliate.commissionRate if allowed
        const commissionAmount = (subtotal * (commissionRate / 100)).toFixed(2);

        // 6. Create Commission Record
        await Commission.create({
            orderId: order.id.toString(),
            affiliate: affiliate._id,
            orderSubtotal: subtotal,
            commissionAmount: parseFloat(commissionAmount),
            commissionRate: commissionRate,
            status: 'pending' // Requirement: Status on creation: "pending"
        });

        console.log(`Commission created for Order ${order.id}: ${commissionAmount} (Affiliate: ${affiliate.name})`);

        // Requirement: NO Admin API calls (Tagging removed)

        res.status(200).send('Webhook processed');

    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { handleOrderCreate };
