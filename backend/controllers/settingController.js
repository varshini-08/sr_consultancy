const Setting = require('../models/Setting');

const getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        console.log('Update Settings request received');

        // Remove read-only fields to prevent Mongoose errors
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.__v;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        console.log('Processed update data:', updateData);

        let settings = await Setting.findOneAndUpdate({}, updateData, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
        });

        console.log('Settings successfully persistent in DB');
        res.json(settings);
    } catch (error) {
        console.error('Update Settings Error Detailed:', error);
        res.status(500).json({
            message: 'Failed to update settings (Server Error)',
            error: error.message
        });
    }
};

const testEmail = async (req, res) => {
    const { sendOrderEmail } = require('../utils/notification');
    try {
        const dummyOrder = {
            _id: 'TEST_ORDER_123',
            shippingAddress: {
                name: 'Test Customer',
                mobileNumber: '1234567890',
                address: '123 Bakery Lane',
                city: 'Sweet Town',
                postalCode: '641001'
            },
            orderItems: [
                { name: 'Chocolate Cake', quantity: 1 },
                { name: 'Vanilla Pastry', quantity: 2 }
            ],
            totalAmount: 500,
            paymentMethod: 'Test'
        };

        const success = await sendOrderEmail(dummyOrder);
        if (success) {
            res.json({ success: true, message: 'Test email sent successfully!' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send test email. Check server logs.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings,
    testEmail
};
