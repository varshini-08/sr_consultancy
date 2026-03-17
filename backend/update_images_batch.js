const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const updates = [
            { name: 'Egg Mushroom Fry', img: '/uploads/egg_mushroom_fry_new.png' },
            { name: 'Paneer Manchurian', img: '/uploads/paneer_manchurian_new.png' },
            { name: 'Chicken Manchurian', img: '/uploads/chicken_manchurian_new.png' },
            { name: 'Full', img: '/uploads/full_new.png' },
            { name: 'Quarter', img: '/uploads/quarter_new.png' },
            { name: 'Boneless Chicken 65', img: '/uploads/boneless_chicken_65_new.jpg' }
        ];

        for (const update of updates) {
            const result = await Product.updateOne(
                { name: update.name },
                { $set: { image: update.img } }
            );
            console.log(`Updated ${update.name}: ${result.modifiedCount} document(s) updated.`);
        }

        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
};

updateImages();
