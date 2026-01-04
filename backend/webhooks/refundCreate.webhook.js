const Commission = require('../models/Commission');
const { verifyWebhook } = require('../utils/verifyWebhook');

// @desc    Handle Shopify Refunds Create Webhook
// @route   POST /api/webhooks/refunds/create
// @access  Public (Verified by HMAC)
const handleRefundCreate = async (req, res) => {
    try {
        // 1. Verify HMAC
        if (!verifyWebhook(req)) {
            console.error('Webhook verification failed');
            return res.status(401).send('Unauthorized');
        }

        const refund = req.body;
        const orderId = refund.order_id.toString();

        console.log(`Received Webhook: Refund for Order ${orderId}`);

        // 2. Find Commission
        const commission = await Commission.findOne({ orderId });

        if (!commission) {
            console.log(`No commission found for refunded order ${orderId}`);
            return res.status(200).send('No commission found');
        }

        if (commission.status === 'cancelled') {
            return res.status(200).send('Commission already cancelled');
        }

        // 3. Calculate Refunded Subtotal
        // We iterate through refund_line_items to get the actual subtotal refunded
        let refundedSubtotal = 0.0;

        if (refund.refund_line_items && refund.refund_line_items.length > 0) {
            refundedSubtotal = refund.refund_line_items.reduce((sum, item) => {
                return sum + parseFloat(item.subtotal);
            }, 0);
        } else {
            // Fallback for custom amount refunds (less accurate as it might include shipping)
            // But we have no choice if line items aren't mapped
            // We'll use the transaction amount minus any tax/shipping explicitly listed, checking 'transactions'
            // For simplicity in this constraint-heavy env, if no line items, we skip or assume 0? 
            // Better: use transaction amount.
            // refund.transactions might exist.
            // Let's stick to line items as primay source for subtotal-based commission logic.
            console.log('No refund line items found, checking total transactions.');
            // Logic: If manual adjustment, we might just assume it applies to subtotal if not specified.
            // But strict subtotal logic requires line items.
            // We will proceed with 0 if no line items, or maybe specific manual logic needed.
            // For strict accuracy:
            if (refund.transactions) {
                refundedSubtotal = refund.transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0);
            }
        }

        console.log(`Refunded Subtotal detected: ${refundedSubtotal}`);

        const originalSubtotal = commission.orderSubtotal;

        // Safety check to avoid division by zero
        if (originalSubtotal <= 0) {
            return res.status(200).send('Original subtotal is 0/invalid');
        }

        // 4. Update Logic
        // Case A: Full Refund (or greater due to currency/rounding?)
        if (refundedSubtotal >= originalSubtotal || refundedSubtotal >= commission.orderSubtotal) {
            // Mark Cancelled
            commission.status = 'cancelled';
            commission.commissionAmount = 0;
            console.log('Detected Full Refund. Commission Cancelled.');
        }
        // Case B: Partial Refund
        else {
            // Logic: commissionAmount = original_commission_amount - (refunded_subtotal * commissionRate)
            // OR Logic from prompt: new = original * (1 - ratio).
            // Since we are handling *events*, we should reduce the *current* commission by the *refunded* portion.

            const commissionRate = commission.commissionRate / 100; // e.g., 0.10
            const deduction = refundedSubtotal * commissionRate;

            commission.commissionAmount = (commission.commissionAmount - deduction).toFixed(2);

            // Prevent negative
            if (commission.commissionAmount < 0) commission.commissionAmount = 0;

            console.log(`Partial Refund. Reducing commission by ${deduction}. New Amount: ${commission.commissionAmount}`);
        }

        await commission.save();

        res.status(200).send('Refund processed');

    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { handleRefundCreate };
