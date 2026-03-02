const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // 'Cakes', 'Snacks', etc.
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    description: { type: String },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
