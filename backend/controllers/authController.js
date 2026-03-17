const User = require('../models/User');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        await Activity.create({ user: user._id, action: 'Registered', details: 'Created a new account' });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const authUser = async (req, res) => {
    const { email, password } = req.body;

    // Hardcoded Admin
    if (email === 'varshini.odc@gmail.com' && password === 'varchu') {
        const adminId = '000000000000000000000000';
        return res.json({
            _id: adminId,
            name: 'Varshini (Admin)',
            email: 'varshini.odc@gmail.com',
            role: 'admin',
            token: generateToken(adminId),
        });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        await Activity.create({ user: user._id, action: 'Logged In', details: 'Successfully logged into the platform' });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { registerUser, authUser };
