const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sr_bakery';

// Product Model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: String,
  price: Number,
  category: String,
  countInStock: Number,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const migrateImagesToMongo = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected.');

        const conn = mongoose.connection;
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });

        // Find products with local paths (starting with /uploads/)
        const products = await Product.find({ image: { $regex: /^\/uploads\// } });
        console.log(`Found ${products.length} products with local images.`);

        for (const product of products) {
            const localPath = path.join(__dirname, '..', product.image);
            
            if (fs.existsSync(localPath)) {
                console.log(`Migrating ${product.name} (${product.image})...`);
                
                const fileName = path.basename(localPath);
                const uploadStream = bucket.openUploadStream(fileName);
                const fileId = uploadStream.id;

                await new Promise((resolve, reject) => {
                    fs.createReadStream(localPath)
                        .pipe(uploadStream)
                        .on('finish', resolve)
                        .on('error', reject);
                });

                console.log(`Succesfully uploaded to GridFS with ID: ${fileId}`);
                
                product.image = `/api/upload/image/${fileId}`;
                await product.save();
                console.log(`Updated database record for ${product.name}.`);
            } else {
                console.warn(`File not found: ${localPath}. Skipping.`);
            }
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateImagesToMongo();
