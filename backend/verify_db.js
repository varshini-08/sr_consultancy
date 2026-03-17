const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});
        console.log('--- Database Verification ---');
        products.forEach(p => {
            if (p.image && p.image.includes('new')) {
                console.log(`[UPDATED] ${p.name}: ${p.image}`);
            } else if (p.image) {
                console.log(`[OLD/DEFAULT] ${p.name}: ${p.image}`);
            } else {
                console.log(`[EMPTY] ${p.name}: (no image)`);
            }
        });
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyData();
