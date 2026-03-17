const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const verifySelected = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const names = [
            'Mushroom Fry', 'Gobi 65', 'Paneer 65', 'Chicken Fried Lollipop', 
            'Egg Mushroom Fry', 'Paneer Manchurian', 'Chicken Manchurian', 
            'Full', 'Quarter', 'Boneless Chicken 65', 'Mushroom 65', 
            'Gobi Manchurian', 'Mushroom Manchurian', 'Chicken Fried Wings', 'Half'
        ];
        const products = await Product.find({ name: { $in: names } });
        console.log('--- Database Verification (Selected) ---');
        products.forEach(p => console.log(`${p.name} -> ${p.image}`));
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifySelected();
