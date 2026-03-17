const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sr_bakery');
        console.log('Connected to MongoDB');

        const updates = [
            { name: 'Mushroom Fry', image: 'Mushroom Fry.jpg' },
            { name: 'Gobi 65', image: 'Gobi 65.jpg' },
            { name: 'Mushroom 65', image: 'Mushroom 65.jpg' },
            { name: 'Paneer 65', image: 'Paneer 65.jpg' },
            { name: 'Paneer Manchurian', image: 'Paneer Manchurian.jpg' },
            { name: 'Mushroom Manchurian', image: 'Mushroom Manchurian.jpg' }
        ];

        for (const update of updates) {
            const result = await Product.updateOne(
                { name: new RegExp('^' + update.name + '$', 'i') },
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
