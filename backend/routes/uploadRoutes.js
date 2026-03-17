const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Create GridFS storage engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/sr_bakery',
    file: (req, file) => {
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: 'uploads' // collection name in MongoDB
        };
    }
});

const upload = multer({ storage });

// @desc    Upload image to GridFS
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    res.send({
        message: 'Image uploaded successfully',
        image: `/api/upload/image/${req.file.id}`, // Return the file ID for retrieval
    });
});

// @desc    Get image from GridFS
// @route   GET /api/upload/image/:id
// @access  Public
router.get('/image/:id', async (req, res) => {
    try {
        const conn = mongoose.connection;
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });

        const fileId = new mongoose.Types.ObjectId(req.params.id);
        
        // Find file to set content type
        const files = await bucket.find({ _id: fileId }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).send({ message: 'No file found' });
        }

        const file = files[0];
        res.set('Content-Type', file.contentType || 'image/jpeg');

        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream.on('error', (err) => {
            res.status(404).json({ message: 'Error retrieving file' });
        });

        downloadStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

module.exports = router;
