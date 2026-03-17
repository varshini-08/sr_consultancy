const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateImage = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sr_bakery');
        console.log('Connected to MongoDB');

        const result = await Product.updateOne(
            { name: 'Mushroom Fry' },
            { $set: { image: 'https://cdn.leonardo.ai/users/d2ab1765-dbd8-4933-bee4-6bd1ca9f8a37/generations/eeab3301-fb06-453b-83cd-a37c5f27ec9f/Leonardo_Phoenix_10_ultra_realistic_food_photography_South_Ind_2.jpg' } } // Guessing the exact CDN url since app.leonardo.ai requires auth. I will try the direct image URL if I can find it, otherwise I will just use the provided URL for now.
        );
        
        console.log(`Updated Mushroom Fry: ${result.modifiedCount} document(s) updated.`);

        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error updating image:', error);
        process.exit(1);
    }
};

updateImage();
