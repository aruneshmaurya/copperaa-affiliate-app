const Affiliate = require('../models/Affiliate');
const Commission = require('../models/Commission');
const { verifyWebhook } = require('../utils/verifyWebhook');
const { tagOrder } = require('../utils/shopifyApi');

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

        // 2. Check Financial Status (PAID only)
        if (order.financial_status !== 'paid') {
            console.log(`Order ${order.id} is ${order.financial_status}, ignoring.`);
            return res.status(200).send('Ignored: Not paid');
        }

        // 3. Detect Affiliate
        let affiliateCode = null;

        // Check Note Attributes (Priority 2)
        if (order.note_attributes) {
            const refAttr = order.note_attributes.find(attr => attr.name === 'affiliate_ref');
            if (refAttr) {
                affiliateCode = refAttr.value;
            }
        }

        // Check Order Tags (Priority 1 - Override)
        // If an order already has a tag 'Affiliate: CODE | 10%', extract code.
        // Useful if tags were added manually or by another process.
        if (order.tags) {
            const tags = order.tags.split(',').map(t => t.trim());
            const affTag = tags.find(t => t.startsWith('Affiliate:'));
            if (affTag) {
                // Format: Affiliate: CODE | 10%
                const parts = affTag.split('|')[0].replace('Affiliate:', '').trim();
                affiliateCode = parts;
            }
        }

        if (!affiliateCode) {
            console.log(`Order ${order.id} has no affiliate attribution.`);
            return res.status(200).send('No affiliate found');
        }

        // 4. Validate Affiliate
        const affiliate = await Affiliate.findOne({ affiliateCode, approved: true });

        if (!affiliate) {
            console.error(`Affiliate code ${affiliateCode} not found or not approved.`);
            return res.status(200).send('Invalid affiliate');
        }

        // 5. Check for Existing Commission
        const existingCommission = await Commission.findOne({ orderId: order.id.toString() });
        if (existingCommission) {
            console.log(`Commission already exists for order ${order.id}`);
            return res.status(200).send('Duplicate commission');
        }

        // 6. Calculate Commission
        // Use Shop Currency Subtotal
        const subtotalSet = order.current_subtotal_price_set;
        let shopMoneyAmount = 0;

        if (subtotalSet && subtotalSet.shop_money) {
            shopMoneyAmount = parseFloat(subtotalSet.shop_money.amount);
        } else {
            // Fallback (unsafe but better than 0)
            shopMoneyAmount = parseFloat(order.subtotal_price);
        }

        const commissionRate = affiliate.commissionRate || 10;
        const commissionAmount = (shopMoneyAmount * (commissionRate / 100)).toFixed(2);

        // 7. Create Commission Record
        await Commission.create({
            orderId: order.id.toString(),
            affiliate: affiliate._id,
            orderSubtotal: shopMoneyAmount,
            commissionAmount: parseFloat(commissionAmount),
            commissionRate: commissionRate,
            status: 'unpaid'
        });

        console.log(`Commission created for Order ${order.id}: ${commissionAmount} (Affiliate: ${affiliate.name})`);

        // 8. Tag Shopify Order
        // Prepare new tags
        const newTag = `Affiliate: ${affiliate.affiliateCode} | ${commissionRate}%`;
        let updatedTags = order.tags ? order.tags : '';

        if (!updatedTags.includes(newTag)) {
            updatedTags = updatedTags ? `${updatedTags}, ${newTag}` : newTag;
            await tagOrder(order.id, updatedTags);
        }

        res.status(200).send('Webhook processed');

    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { handleOrderCreate };
