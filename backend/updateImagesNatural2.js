const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sr_bakery');
        console.log('Connected to MongoDB');

        const updates = [
            { name: 'Gobhi Manchurian', image: '/images/gobhi_manchurian_natural.png' },
            { name: 'Egg Mushroom Fry', image: '/images/egg_mushroom_fry_natural.png' }
        ];

        for (const update of updates) {
            const result = await Product.updateOne(
                { name: update.name },
                { $set: { image: update.image } }
            );
            console.log(`Updated ${update.name}: ${result.modifiedCount} document(s) matched and updated.`);
        }

        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
};

updateImages();
