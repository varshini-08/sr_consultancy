const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    storeName: { type: String, required: true, default: 'SR Bakery' },
    contactEmail: { type: String, required: true, default: 'admin@srbakery.com' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    whatsappNumber: { type: String, default: '918220373220' },
    socialLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' }
    },
    openingHours: { type: String, default: '9:00 AM - 10:00 PM' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
