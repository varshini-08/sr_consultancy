const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

dotenv.config();

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Database Connection ---');
        console.log('Connected to:', mongoose.connection.name);

        const products = await Product.find({ 
            name: { $in: [
                'Mushroom Fry', 'Gobi 65', 'Paneer 65', 'Chicken Fried Lollipop', 
                'Egg Mushroom Fry', 'Paneer Manchurian', 'Chicken Manchurian', 
                'Full', 'Quarter', 'Boneless Chicken 65', 'Mushroom 65', 
                'Gobi Manchurian', 'Mushroom Manchurian', 'Chicken Fried Wings', 'Half'
            ]}
        });

        console.log('\n--- Image Check Report ---');
        for (const p of products) {
            const dbPath = p.image;
            let exists = false;
            let fullPath = '';
            
            if (dbPath && dbPath.startsWith('/uploads/')) {
                const fileName = dbPath.replace('/uploads/', '');
                fullPath = path.join(__dirname, 'uploads', fileName);
                exists = fs.existsSync(fullPath);
            }
            
            console.log(`Product: ${p.name}`);
            console.log(`  DB Path: ${dbPath}`);
            console.log(`  File Exists: ${exists ? 'YES' : 'NO'}`);
            if (!exists && dbPath) {
                console.log(`  Expected Full Path: ${fullPath}`);
            }
        }

        const uploadsDir = path.join(__dirname, 'uploads');
        if (fs.existsSync(uploadsDir)) {
            console.log('\n--- Files in uploads/ ---');
            const files = fs.readdirSync(uploadsDir);
            files.forEach(f => console.log('  ' + f));
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkImages();
