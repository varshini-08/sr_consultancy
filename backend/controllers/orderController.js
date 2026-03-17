const Order = require('../models/Order');
const Activity = require('../models/Activity');
const Product = require('../models/Product');
const razorpayInstance = require('../utils/razorpay');
const crypto = require('crypto');
const { sendOrderEmail, sendTelegramNotification } = require('../utils/notification');

const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalAmount,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        // Defensive Check: Ensure name exists in shippingAddress
        if (!shippingAddress.name) {
            console.warn("COD Order data missing name field, defaulting to user name");
            shippingAddress.name = req.user?.name || 'Customer';
        }

        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress: { ...shippingAddress },
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalAmount,
            status: 'Pending'
        });

        // Validate Stock first
        if (orderItems && orderItems.length > 0) {
            for (const item of orderItems) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    res.status(404);
                    throw new Error(`Product not found: ${item.name}`);
                }
                if (product.stock < item.quantity) {
                    res.status(400);
                    throw new Error(`Insufficient stock for ${item.name}. Available: ${product.stock}`);
                }
            }

            // Deduct Stock if all verified
            for (const item of orderItems) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock -= item.quantity;
                    await product.save();
                }
            }
        }

        const createdOrder = await order.save();

        await Activity.create({
            user: req.user._id,
            action: 'Placed Order',
            details: `Placed a new order totaling ₹${totalAmount}`
        });

        // Trigger Admin Notifications (Async, non-blocking)
        sendOrderEmail(createdOrder).catch(err => console.error('COD email error:', err));
        sendTelegramNotification(createdOrder).catch(err => console.error('COD telegram error:', err));

        res.status(201).json(createdOrder);
    }
};

const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status;
        if (req.body.status === 'Delivered') {
            order.deliveredAt = Date.now();
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        console.log('Received Razorpay Create Order request for amount:', amount);

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required for Razorpay order' });
        }

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        console.log('Razorpay Options:', options);
        console.log('Using Key ID:', process.env.RAZORPAY_KEY_ID);

        const order = await razorpayInstance.orders.create(options);
        console.log('Razorpay Order Created Successfully:', order.id);
        res.status(200).json(order);
    } catch (error) {
        console.error('CRITICAL: Razorpay Order Creation Failed!');
        
        let errorMessage = 'Error creating Razorpay order';
        let details = error.error?.description || error.message;

        if (error.statusCode === 401) {
            console.error('CAUSE: Invalid Razorpay API Keys (401 Unauthorized)');
            errorMessage = 'Razorpay Authentication Failed';
            details = 'The API keys provided in the .env file are invalid or expired. Please check your Razorpay dashboard.';
        }

        console.error('Error Status Code:', error.statusCode);
        console.error('Error Description:', details);
        console.error('Full Error Object:', JSON.stringify(error, null, 2));
        
        res.status(error.statusCode || 500).json({
            message: errorMessage,
            details: details
        });
    }
};

const verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderData
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {
            console.log("Payment verified successfully for order:", razorpay_order_id);
            console.log("Current user in verifyPayment:", req.user ? req.user._id : 'NO USER');
            console.log("Order Data received from frontend:", JSON.stringify(orderData, null, 2));

            console.log("Saving order to database...");
            // Logic to save order to database after successful payment

            // Defensive Check: Ensure name exists in shippingAddress
            if (!orderData.shippingAddress.name) {
                console.warn("Order data missing name field, defaulting to user name");
                orderData.shippingAddress.name = req.user?.name || 'Customer';
            }

            // Strip potentially conflicting fields from orderData
            const cleanOrderData = { ...orderData };
            delete cleanOrderData._id;
            delete cleanOrderData.__v;
            delete cleanOrderData.user;
            delete cleanOrderData.createdAt;
            delete cleanOrderData.updatedAt;

            const order = new Order({
                ...cleanOrderData,
                user: req.user._id,
                isPaid: true,
                paidAt: Date.now(),
                paymentResult: {
                    id: razorpay_payment_id,
                    status: 'Completed',
                    update_time: Date.now().toString(),
                },
                paymentMethod: 'Razorpay',
                status: 'Pending'
            });

            // Stock reduction logic (Duplicate from addOrderItems for consistency)
            for (const item of orderData.orderItems) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock -= item.quantity;
                    await product.save();
                }
            }

            const createdOrder = await order.save();

            await Activity.create({
                user: req.user._id,
                action: 'Placed Order',
                details: `Placed a new order totaling ₹${orderData.totalAmount} via Razorpay`
            });

            // Trigger Admin Notifications (Async, non-blocking)
            console.log("Triggering admin notifications for Razorpay order...");
            sendOrderEmail(createdOrder).catch(err => console.error('Razorpay email notification error:', err));
            sendTelegramNotification(createdOrder).catch(err => console.error('Razorpay telegram notification error:', err));

            res.status(201).json({
                success: true,
                order: createdOrder
            });
        } catch (error) {
            console.error('Verify Payment Save Error:', error);
            res.status(500).json({ message: 'Error saving order after payment' });
        }
    } else {
        res.status(400).json({
            success: false,
            message: 'Payment verification failed'
        });
    }
};

const generateInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Security: Ensure user only views their own invoice unless admin
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this invoice' });
        }

        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const itemsHtml = order.orderItems.map(item => `
            <tr>
                <td>${item.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">₹${item.price}</td>
                <td style="text-align: right;">₹${item.price * item.quantity}</td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #5d4037; padding-bottom: 20px; }
                    .invoice-title { color: #5d4037; font-size: 24px; margin: 0; }
                    .details { margin: 30px 0; display: flex; justify-content: space-between; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #fdfbf7; color: #5d4037; padding: 10px; border-bottom: 2px solid #eee; text-align: left; }
                    td { padding: 10px; border-bottom: 1px solid #eee; }
                    .total { margin-top: 30px; text-align: right; font-size: 20px; font-weight: bold; color: #d2691e; }
                    .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1 class="invoice-title">SR BAKERY INVOICE</h1>
                        <p>Order ID: #${order._id.toString().toUpperCase()}</p>
                    </div>
                    <div style="text-align: right;">
                        <p><strong>Date:</strong> ${orderDate}</p>
                        <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                    </div>
                </div>

                <div class="details">
                    <div>
                        <h3>Billed To:</h3>
                        <p><strong>${order.shippingAddress.name}</strong></p>
                        <p>${order.shippingAddress.address}</p>
                        <p>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
                        <p>Phone: ${order.shippingAddress.mobileNumber}</p>
                    </div>
                    <div style="text-align: right;">
                        <h3>Store Info:</h3>
                        <p><strong>SR Bakery</strong></p>
                        <p>Coimbatore, Tamil Nadu</p>
                        <p>Email: varshini.odc@gmail.com</p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Rate</th>
                            <th style="text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div class="total">
                    Grand Total: ₹${order.totalAmount}
                </div>

                <div class="footer">
                    Thank you for your business! This is a system-generated invoice.
                </div>

                <script>
                    // Auto-print if opened directly in browser
                    window.onload = () => { if(window.location.search.includes('print')) window.print(); }
                </script>
            </body>
            </html>
        `;

        await Activity.create({
            user: req.user._id,
            action: 'Viewed Invoice',
            details: `Accessed invoice for Order #${order._id.toString().substring(20, 24)}`
        });

        res.send(html);
    } catch (error) {
        console.error('Invoice Error:', error);
        res.status(500).json({ message: 'Error generating invoice' });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getMyOrders,
    getOrders,
    createRazorpayOrder,
    verifyPayment,
    generateInvoice,
};
