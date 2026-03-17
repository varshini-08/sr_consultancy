const Razorpay = require('razorpay');
const path = require('path');

// Explicitly load .env from the backend root to ensure variables are available
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_id.startsWith('rzp_')) {
    console.error('CRITICAL ERROR: Razorpay Key ID is missing or invalid in backend .env!');
}

const razorpayInstance = new Razorpay({
    key_id: key_id || 'rzp_test_placeholder',
    key_secret: key_secret || 'placeholder_secret',
});

module.exports = razorpayInstance;
