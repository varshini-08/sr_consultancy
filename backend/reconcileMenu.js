const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const menuItems = [
    // NOODLES
    { name: 'Mushroom Noodles', category: 'Noodles', price: 120, description: 'Stir-fried noodles with fresh mushrooms and veggies.' },
    { name: 'Gobi Noodles', category: 'Noodles', price: 110, description: 'Noodles tossed with crispy cauliflower florets.' },
    { name: 'Egg Noodles', category: 'Noodles', price: 130, description: 'Classic stir-fried egg noodles with aromatic spices.' },
    { name: 'Chicken Noodles', category: 'Noodles', price: 150, description: 'Savory noodles with tender chicken pieces.' },
    { name: 'Veg Hakka Noodles', category: 'Noodles', price: 100, description: 'Authentic Indo-Chinese style vegetable noodles.' },
    { name: 'Schezwan Veg Noodles', category: 'Noodles', price: 110, description: 'Spicy noodles with vegetables in Schezwan sauce.' },
    { name: 'Schezwan Chicken Noodles', category: 'Noodles', price: 160, description: 'Fiery chicken noodles with a Schezwan kick.' },
    { name: 'Paneer Noodles', category: 'Noodles', price: 140, description: 'Noodles tossed with soft paneer cubes and veggies.' },

    // PIZZA (7 INCH)
    { name: 'Veg Pizza', category: 'Pizza', price: 150, description: '7-inch pizza topped with assorted fresh vegetables.' },
    { name: 'Mushroom Pizza', category: 'Pizza', price: 170, description: 'Delicious pizza loaded with grilled mushrooms.' },
    { name: 'Paneer Pizza', category: 'Pizza', price: 180, description: 'Tantalizing pizza with spiced paneer toppings.' },
    { name: 'Cheese Pizza', category: 'Pizza', price: 140, description: 'Classic mozzarella cheese pizza.' },
    { name: 'Chicken Pizza', category: 'Pizza', price: 200, description: 'Pizza topped with seasoned chicken chunks.' },
    { name: 'Chicken Tikka Pizza', category: 'Pizza', price: 220, description: 'Indian-style pizza with succulent chicken tikka.' },
    { name: 'Corn Cheese Pizza', category: 'Pizza', price: 160, description: 'Sweet corn and extra cheese on a crispy base.' },
    { name: 'Veg Supreme Pizza', category: 'Pizza', price: 190, description: 'Loaded with all our favorite mixed vegetables.' },
    { name: 'Paneer Tikka Pizza', category: 'Pizza', price: 210, description: 'Spicy paneer tikka on a cheesy pizza base.' },
    { name: 'Spicy Chicken Pizza', category: 'Pizza', price: 210, description: 'Hot and spicy chicken pizza for chili lovers.' },

    // BURGERS
    { name: 'Veg Burger', category: 'Burgers', price: 80, description: 'Crispy veg patty with fresh lettuce and sauce.' },
    { name: 'Paneer Burger', category: 'Burgers', price: 100, description: 'Soft paneer patty with specialty dressing.' },
    { name: 'Cheese Burger', category: 'Burgers', price: 90, description: 'Classic burger with a thick slice of melting cheese.' },
    { name: 'Chicken Burger', category: 'Burgers', price: 120, description: 'Juicy chicken patty with garden fresh veggies.' },
    { name: 'Chicken Zinger Burger', category: 'Burgers', price: 150, description: 'Extra crispy and spicy chicken fillet burger.' },
    { name: 'Double Cheese Burger', category: 'Burgers', price: 130, description: 'Two slices of cheese for double the indulgence.' },
    { name: 'Paneer Tikka Burger', category: 'Burgers', price: 120, description: 'Spicy marinated paneer tikka in a toasted bun.' },
    { name: 'Spicy Chicken Burger', category: 'Burgers', price: 130, description: 'Zesty chicken burger with a spicy kick.' },
    { name: 'Crispy Veg Burger', category: 'Burgers', price: 90, description: 'Extra crunchy vegetable patty burger.' },
    { name: 'Loaded Chicken Burger', category: 'Burgers', price: 160, description: 'Double patty chicken burger with extra toppings.' },

    // SANDWICH
    { name: 'Chocolate Sandwich', category: 'Sandwich', price: 70, description: 'Decadent chocolate spread in grilled bread.' },
    { name: 'Veg Sandwich', category: 'Sandwich', price: 50, description: 'Simple and fresh vegetable sandwich.' },
    { name: 'Mushroom Sandwich', category: 'Sandwich', price: 80, description: 'Sautéed mushrooms and spices in grilled bread.' },
    { name: 'Paneer Sandwich', category: 'Sandwich', price: 90, description: 'Spiced paneer filling in a perfectly toasted sandwich.' },
    { name: 'Cheese Sandwich', category: 'Sandwich', price: 60, description: 'Classic grilled cheese sandwich.' },
    { name: 'Egg Sandwich', category: 'Sandwich', price: 70, description: 'Fried egg and seasonings in sliced bread.' },
    { name: 'Chicken Sandwich', category: 'Sandwich', price: 100, description: 'Grilled chicken and mayo sandwich.' },
    { name: 'Corn Cheese Sandwich', category: 'Sandwich', price: 80, description: 'Sweet corn and cheese grilled together.' },
    { name: 'Paneer Tikka Sandwich', category: 'Sandwich', price: 110, description: 'Indian-style paneer tikka grilled sandwich.' },
    { name: 'Grilled Veg Sandwich', category: 'Sandwich', price: 60, description: 'Standard grilled sandwich with mixed veggies.' },
    { name: 'Grilled Chicken Sandwich', category: 'Sandwich', price: 110, description: 'Juicy chicken breast pieces grilled in bread.' },
    { name: 'Masala Egg Sandwich', category: 'Sandwich', price: 80, description: 'Spicy masala omelette inside grilled bread.' },

    // CHAATS
    { name: 'Bhel Puri', category: 'Chaats', price: 40, description: 'Crispy puffed rice mixed with tangy chutneys.' },
    { name: 'Pani Puri (5 pieces)', category: 'Chaats', price: 30, description: 'Classic street style pani puri.' },
    { name: 'Masala Puri', category: 'Chaats', price: 40, description: 'Crushed puris with spicy peas gravy.' },
    { name: 'Egg Bhel Puri', category: 'Chaats', price: 50, description: 'Bhel puri topped with chopped boiled eggs.' },
    { name: 'Dahi Puri', category: 'Chaats', price: 60, description: 'Puris filled with yogurt and sweet chutneys.' },
    { name: 'Sev Puri', category: 'Chaats', price: 50, description: 'Crispy puris topped with lots of sev.' },
    { name: 'Aloo Chaat', category: 'Chaats', price: 40, description: 'Tangy and spicy potato salad.' },
    { name: 'Samosa Chaat', category: 'Chaats', price: 60, description: 'Crushed samosas topped with chickpeas and chutneys.' },
    { name: 'Papdi Chaat', category: 'Chaats', price: 50, description: 'Crispy papdis topped with spiced potatoes and yogurt.' },
    { name: 'Corn Chaat', category: 'Chaats', price: 50, description: 'Healthy and spicy sweet corn mix.' },

    // FRIES & POPS
    { name: 'French Fries', category: 'Fries & Pops', price: 70, description: 'Golden crispy classic french fries.' },
    { name: 'Spicy Fries', category: 'Fries & Pops', price: 80, description: 'Classic fries with a spicy seasoning.' },
    { name: 'Kung Fu Fries', category: 'Fries & Pops', price: 100, description: 'Spicy seasoned fries with an Asian twist.' },
    { name: 'Potato Garlic Pops', category: 'Fries & Pops', price: 60, description: 'Bite-sized potato snacks with a garlic punch.' },
    { name: 'Cheese Fries', category: 'Fries & Pops', price: 110, description: 'Fries smothered in warm melted cheese.' },
    { name: 'Peri Peri Fries', category: 'Fries & Pops', price: 90, description: 'Spicy African-inspired peri peri seasoned fries.' },
    { name: 'Loaded Fries', category: 'Fries & Pops', price: 140, description: 'Fries topped with cheese, sauces, and more.' },
    { name: 'Masala Fries', category: 'Fries & Pops', price: 80, description: 'Indian spiced crispy potato fries.' },
    { name: 'Crispy Potato Pops', category: 'Fries & Pops', price: 60, description: 'Mini crunchy potato bites.' },
    { name: 'Cheesy Garlic Pops', category: 'Fries & Pops', price: 90, description: 'Garlic pops with a cheese center.' },

    // QUICK BITES
    { name: 'Bread Omelette', category: 'Quick Bites', price: 40, description: 'Fluffy omelette wrapped around toasted bread.' },
    { name: 'Egg Omelette', category: 'Quick Bites', price: 30, description: 'Simple two-egg omelette with onions.' },
    { name: 'Masala Omelette', category: 'Quick Bites', price: 40, description: 'Spicy omelette with Indian aromatics.' },
    { name: 'Cheese Omelette', category: 'Quick Bites', price: 60, description: 'Creamy omelette with melting cheese.' },
    { name: 'Chicken Omelette', category: 'Quick Bites', price: 80, description: 'Protein-packed chicken and egg mix.' },
    { name: 'Veg Omelette', category: 'Quick Bites', price: 40, description: 'Omelette with finely chopped garden vegetables.' },
    { name: 'Butter Bread Toast', category: 'Quick Bites', price: 25, description: 'Perfectly toasted bread with premium butter.' },
    { name: 'Garlic Bread', category: 'Quick Bites', price: 60, description: 'Toasted bread infused with garlic butter.' },
    { name: 'Cheese Garlic Bread', category: 'Quick Bites', price: 90, description: 'Garlic bread topped with gooey cheese.' },
    { name: 'Masala Bread Toast', category: 'Quick Bites', price: 40, description: 'Spicy and tangy bread toast.' },
    { name: 'Egg Toast', category: 'Quick Bites', price: 50, description: 'Fried egg on a crispy toast.' },
    { name: 'Chicken Toast', category: 'Quick Bites', price: 90, description: 'Grilled chicken spread over toasty bread.' },
    { name: 'Veg Cutlet', category: 'Quick Bites', price: 30, description: 'Deep fried mashed vegetable patties.' },
    { name: 'Paneer Cutlet', category: 'Quick Bites', price: 50, description: 'Soft paneer and potato fried cutlets.' },
    { name: 'Chicken Cutlet', category: 'Quick Bites', price: 60, description: 'Spicy ground chicken fried patties.' },
    { name: 'Potato Cutlet', category: 'Quick Bites', price: 25, description: 'Classic spiced potato cutlets.' }
];

const reconcile = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sr_bakery');
        console.log('Connected to MongoDB');

        // Since the user said every item MUST have an image and NO item should be skipped,
        // we'll populate the database with these 76 items.
        // We'll set the image to a placeholder which our new UI will handle with themed cards.

        for (const item of menuItems) {
            const existing = await Product.findOne({ name: item.name });
            if (existing) {
                // Update category and details if changed
                await Product.updateOne({ _id: existing._id }, {
                    $set: {
                        category: item.category,
                        description: item.description,
                        price: item.price
                    }
                });
                console.log(`Updated existing item: ${item.name}`);
            } else {
                // Create new item
                await Product.create({
                    ...item,
                    image: '/images/placeholder', // This triggers the premium placeholder UI
                    stock: 20,
                    isAvailable: true
                });
                console.log(`Created new item: ${item.name}`);
            }
        }

        console.log('Menu reconciliation complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error during reconciliation:', error);
        process.exit(1);
    }
};

reconcile();
