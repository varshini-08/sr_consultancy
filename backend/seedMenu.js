const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const menuItems = [
    // Starters / Snacks
    { name: 'Mushroom Fry', category: 'Starters', price: 65 },
    { name: 'Gobi 65', category: 'Starters', price: 75 },
    { name: 'Mushroom 65', category: 'Starters', price: 85 },
    { name: 'Paneer 65', category: 'Starters', price: 135 },
    { name: 'Paneer Manchurian', category: 'Starters', price: 155 },
    { name: 'Mushroom Manchurian', category: 'Starters', price: 125 },
    { name: 'Gobi Manchurian', category: 'Starters', price: 125 },
    { name: 'Egg Mushroom Fry', category: 'Starters', price: 75 },

    // Chicken Starters
    { name: 'Chicken Manchurian', category: 'Chicken Starters', price: 155 },
    { name: 'Chicken Fried Lollipop', category: 'Chicken Starters', price: 145 },
    { name: 'Chicken Fried Wings', category: 'Chicken Starters', price: 145 },
    { name: 'Boneless Chicken 65', category: 'Chicken Starters', price: 135 },
    { name: 'Crab Lollipop', category: 'Chicken Starters', price: 115 },

    // Grill / BBQ
    { name: 'Quarter', category: 'Grill & BBQ', price: 145 },
    { name: 'Half', category: 'Grill & BBQ', price: 245 },
    { name: 'Full', category: 'Grill & BBQ', price: 465 },

    // Rice
    { name: 'Veg Fried Rice', category: 'Rice', price: 95 },
    { name: 'Mushroom Fried Rice', category: 'Rice', price: 125 },
    { name: 'Paneer Fried Rice', category: 'Rice', price: 125 },
    { name: 'Gobhi Fried Rice', category: 'Rice', price: 125 },
    { name: 'Egg Fried Rice', category: 'Rice', price: 105 },
    { name: 'Chicken Fried Rice', category: 'Rice', price: 125 },

    // Noodles
    { name: 'Paneer Noodles', category: 'Noodles', price: 125 },
    { name: 'Veg Noodles', category: 'Noodles', price: 95 },
    { name: 'Mushroom Noodles', category: 'Noodles', price: 125 },
    { name: 'Gobi Noodles', category: 'Noodles', price: 125 },
    { name: 'Egg Noodles', category: 'Noodles', price: 105 },
    { name: 'Chicken Noodles', category: 'Noodles', price: 125 },

    // Pizza [7 inches]
    { name: 'Veg Pizza [7 inches]', category: 'Pizza', price: 125 },
    { name: 'Mushroom Pizza [7 inches]', category: 'Pizza', price: 155 },
    { name: 'Paneer Pizza [7 inches]', category: 'Pizza', price: 155 },
    { name: 'Cheese Pizza [7 inches]', category: 'Pizza', price: 135 },
    { name: 'Chicken Pizza [7 inches]', category: 'Pizza', price: 155 },

    // Burger
    { name: 'Veg Burger', category: 'Burger', price: 115 },
    { name: 'Paneer Burger', category: 'Burger', price: 145 },
    { name: 'Cheese Burger', category: 'Burger', price: 115 },
    { name: 'Chicken Burger', category: 'Burger', price: 145 },
    { name: 'Chicken Zinger Burger', category: 'Burger', price: 165 },

    // Sandwich
    { name: 'Chocolate Sandwich', category: 'Sandwich', price: 75 },
    { name: 'Veg Sandwich', category: 'Sandwich', price: 75 },
    { name: 'Mushroom Sandwich', category: 'Sandwich', price: 95 },
    { name: 'Paneer Sandwich', category: 'Sandwich', price: 105 },
    { name: 'Cheese Sandwich', category: 'Sandwich', price: 75 },
    { name: 'Egg Sandwich', category: 'Sandwich', price: 85 },
    { name: 'Chicken Sandwich', category: 'Sandwich', price: 105 },

    // Chaats
    { name: 'Bhel Puri', category: 'Chaats', price: 65 },
    { name: 'Pani Puri [5 Pieces]', category: 'Chaats', price: 65 },
    { name: 'Masala Puri', category: 'Chaats', price: 65 },
    { name: 'Egg Bhel Puri', category: 'Chaats', price: 85 },

    // Fries & Pops
    { name: 'French Fries', category: 'Fries & Pops', price: 85 },
    { name: 'Spicy Fries', category: 'Fries & Pops', price: 95 },
    { name: 'Kung Fu Fries', category: 'Fries & Pops', price: 105 },
    { name: 'Potato Garlic Pops', category: 'Fries & Pops', price: 105 },

    // Quick Bites / Snacks
    { name: 'Bread Omelette', category: 'Quick Bites', price: 85 },
    { name: 'Cheese Bread Omelette', category: 'Quick Bites', price: 95 },
    { name: 'Chicken Nuggets [5 Pieces]', category: 'Quick Bites', price: 115 },
    { name: 'Chicken Fingers', category: 'Quick Bites', price: 115 },
    { name: 'Chicken Popcorn', category: 'Quick Bites', price: 105 },
    { name: 'Fish Fingers', category: 'Quick Bites', price: 125 },

    // Shawarma Roll
    { name: 'French Fries Shawarma Roll', category: 'Shawarma', price: 135 },
    { name: 'Chicken Shawarma Roll', category: 'Shawarma', price: 125 },
    { name: 'Special Chicken Shawarma Roll', category: 'Shawarma', price: 145 },
    { name: 'Peri Peri Chicken Shawarma Roll', category: 'Shawarma', price: 135 },
    { name: 'Cheese Shawarma Roll', category: 'Shawarma', price: 135 },

    // Shawarma Plate
    { name: 'French Fries Shawarma Plate', category: 'Shawarma', price: 135 },
    { name: 'Chicken Shawarma Plate', category: 'Shawarma', price: 145 },
    { name: 'Special Chicken Shawarma Plate', category: 'Shawarma', price: 175 },
    { name: 'Peri Peri Chicken Shawarma Plate', category: 'Shawarma', price: 165 },
    { name: 'Cheese Shawarma Plate', category: 'Shawarma', price: 135 },

    // Bulk Orders (Portions)
    { name: '500g Portion (Variant 1)', category: 'Bulk Orders', price: 205 }, // Renamed from '500 x With Egg' for readability, although the menu says '500 x With Egg' so maybe we stick to it? No, menu says "500 x With Egg" but maybe it means 500g. I will use the exact name.
    { name: '500 x With Egg (Var 1)', category: 'Bulk Orders', price: 205 },
    { name: '1 x With Egg (Var 1)', category: 'Bulk Orders', price: 375 },
    { name: '500 x With Egg (Var 2)', category: 'Bulk Orders', price: 225 },
    { name: '1 x With Egg (Var 2)', category: 'Bulk Orders', price: 425 },
    { name: '500 x With Egg (Var 3)', category: 'Bulk Orders', price: 325 },
    { name: '1 x With Egg (Var 3)', category: 'Bulk Orders', price: 625 },

];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sr_bakery');
        console.log('MongoDB Connected');

        await Product.deleteMany();
        console.log('Existing products cleared');

        const productsWithDetails = menuItems.map(item => ({
            ...item,
            stock: 100,
            image: `https://placehold.co/400x300/c0392b/ffffff?text=${encodeURIComponent(item.name)}`,
            description: `A delicious serving of our signature ${item.name}. Prepared fresh upon order.`
        }));

        await Product.insertMany(productsWithDetails);
        console.log('New menu items inserted successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDatabase();
