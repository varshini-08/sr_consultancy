const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const fixMissingImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const updates = [
            { name: 'Mushroom 65', img: '/uploads/mushroom_65_new.jpg' },
            { name: 'Gobi Manchurian', img: '/uploads/gobi_manchurian_new.png' },
            { name: 'Mushroom Manchurian', img: '/uploads/mushroom_manchurian_new.png' },
            { name: 'Chicken Fried Wings', img: '/uploads/chicken_fried_wings_new.png' },
            { name: 'Half', img: '/uploads/half_new.jpg' }
        ];

        for (const update of updates) {
            const result = await Product.updateOne(
                { name: update.name },
                { $set: { image: update.img } }
            );
            console.log(`Updated ${update.name}: ${result.modifiedCount} document(s) updated.`);
        }

        mongoose.connection.close();
        console.log('Done.');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixMissingImages();
