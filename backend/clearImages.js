const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const clearImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sr_bakery');
        console.log('Connected to MongoDB');

        const result = await Product.updateMany(
            {},
            { $set: { image: '' } }
        );
        console.log(`Cleared images: ${result.modifiedCount} document(s) updated out of ${result.matchedCount} matched.`);

        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error clearing images:', error);
        process.exit(1);
    }
};

clearImages();
