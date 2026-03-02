const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed by pre-save hook in model? No, insertMany doesn't trigger pre-save hooks usually!
        // Wait, insertMany DOES NOT trigger middleware. I need to hash manually or use create in loop.
        // OR, I can pre-hash here. 
        // For simplicity in seeder with insertMany, I should provide hashed password or use loop.
        // Let's use a fixed hash for 'password123' to avoid async complexity in this file definition.
        // Hash for 'password123' is approximately: $2a$10$3.v... 
        // Better: I will let the seeder script handle logic or just use a loop in seeder.
        // Actually, let's update seeder to use create() or just hash here.
        role: 'admin',
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
    },
];

module.exports = users;
