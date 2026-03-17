const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sr_bakery');
        const products = await Product.find({ category: { $in: ['Chicken Starters', 'Grill & BBQ'] } });
        console.log(JSON.stringify(products.map(p => ({ name: p.name, image: p.image })), null, 2));
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkImages();
