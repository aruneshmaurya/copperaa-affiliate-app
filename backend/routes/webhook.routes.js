const express = require('express');
const router = express.Router();
const { handleOrderCreate } = require('../webhooks/orderCreate.webhook');
const { handleRefundCreate } = require('../webhooks/refundCreate.webhook');
const { handleOrderCancel } = require('../webhooks/orderCancel.webhook');

// Webhooks needs raw body for HMAC, but we handle that in server.js configuration
router.post('/orders/create', handleOrderCreate);
router.post('/orders/cancelled', handleOrderCancel);
router.post('/refunds/create', handleRefundCreate);

module.exports = router;
