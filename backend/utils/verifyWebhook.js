const crypto = require('crypto');

const verifyWebhook = (req) => {
    try {
        const hmac = req.headers['x-shopify-hmac-sha256'];
        const body = req.rawBody; // Express needs to be configured to provide rawBody
        const secret = process.env.WEBHOOK_SECRET;

        if (!hmac || !body || !secret) {
            return false;
        }

        const digest = crypto
            .createHmac('sha256', secret)
            .update(body, 'utf8')
            .digest('base64');

        return digest === hmac;
    } catch (error) {
        console.error('Webhook verification failed', error);
        return false;
    }
};

module.exports = { verifyWebhook };
