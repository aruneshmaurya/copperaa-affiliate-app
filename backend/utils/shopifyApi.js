const axios = require('axios');

const tagOrder = async (orderId, tags) => {
    try {
        const url = `${process.env.SHOPIFY_STORE_URL}/admin/api/2023-10/orders/${orderId}.json`;

        await axios.put(url, {
            order: {
                id: orderId,
                tags: tags
            }
        }, {
            headers: {
                'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Order ${orderId} tagged successfully: ${tags}`);
    } catch (error) {
        console.error(`Failed to tag order ${orderId}:`, error.response ? error.response.data : error.message);
    }
};

module.exports = { tagOrder };
