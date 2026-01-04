const axios = require('axios');
const crypto = require('crypto');

// --- CONFIGURATION ---
const WEBHOOK_SECRET = '647c0590928d5f8fbfcedeca51eff56933404cd2c55e0e35841ebb6fa82dce70'; // User provided
const TARGET_URL = 'https://copperaa-affiliate-app.onrender.com/api/webhooks/orders/create';
const AFFILIATE_CODE_TO_TEST = process.argv[2]; // Pass affiliate code as argument

if (!AFFILIATE_CODE_TO_TEST) {
    console.error('Please provide your Affiliate Code as an argument.');
    console.error('Usage: node test_webhook_simulator.js <YOUR_AFFILIATE_CODE>');
    process.exit(1);
}

// --- MOCK ORDER PAYLOAD ---
const mockOrder = {
    id: Math.floor(Math.random() * 1000000000),
    email: 'test@example.com',
    subtotal_price: "50.00",
    note_attributes: [
        {
            name: "affiliate_id",
            value: AFFILIATE_CODE_TO_TEST
        }
    ],
    test: true
};

const rawBody = JSON.stringify(mockOrder);

// --- SIGNATURE GENERATION ---
const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64');

console.log(`Sending Webhook to: ${TARGET_URL}`);
console.log(`Affiliate Code: ${AFFILIATE_CODE_TO_TEST}`);
console.log(`HMAC Signature: ${signature}`);

// --- SEND REQUEST ---
axios.post(TARGET_URL, mockOrder, {
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Hmac-Sha256': signature
    }
})
    .then(response => {
        console.log('✅ SUCCESS! Backend accepted the webhook.');
        console.log('Response:', response.data);
        console.log('Check your dashboard now. A pending commission should appear.');
    })
    .catch(error => {
        console.error('❌ FAILED.');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
            if (error.response.status === 401) {
                console.error('Reason: Unauthorized. This means the WEBHOOK_SECRET is mismatched.');
            } else if (error.response.status === 200 && error.response.data.includes('No affiliate found')) {
                console.error('Reason: Backend accepted signature but could not find the Affiliate Code in DB.');
            }
        } else {
            console.error('Error:', error.message);
        }
    });
