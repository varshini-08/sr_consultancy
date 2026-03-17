const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['Logged In', 'Added to Cart', 'Placed Order', 'Viewed Dashboard', 'Registered', 'Viewed Invoice', 'Updated Settings', 'Updated Product']
    },
    details: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
