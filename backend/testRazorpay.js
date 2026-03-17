const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log('Testing Razorpay with:');
console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? '********' : 'MISSING');

instance.orders.all({ count: 1 })
    .then(orders => {
        console.log('SUCCESS: Connectivity verified! Fetched latest order:', orders.items?.[0]?.id || 'No orders found');
        process.exit(0);
    })
    .catch(error => {
        console.error('FAILURE: Razorpay Authentication Failed!');
        console.error('Status Code:', error.statusCode);
        console.error('Description:', error.error?.description || error.message);
        process.exit(1);
    });
