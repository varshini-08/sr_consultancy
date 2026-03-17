const Product = require('../models/Product');

const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

const createProduct = async (req, res) => {
    const { name, category, price, stock, image, description } = req.body;

    if (price < 0 || stock < 0) {
        res.status(400).json({ message: 'Price and Stock cannot be negative' });
        return;
    }

    const product = new Product({
        name,
        category,
        price,
        stock,
        image,
        description
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

const updateProduct = async (req, res) => {
    const { name, category, price, stock, image, description } = req.body;

    if (price < 0 || stock < 0) {
        res.status(400).json({ message: 'Price and Stock cannot be negative' });
        return;
    }

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.category = category;
        product.price = price;
        product.stock = stock;
        product.image = image;
        product.description = description;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

const getCategories = async (req, res) => {
    const categories = await Product.distinct('category');
    res.json(categories);
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories };
