const nodemailer = require('nodemailer');
const axios = require('axios');

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

/**
 * Send Order Confirmation Email to Admin
 * @param {Object} order - Order details from database
 */
const sendOrderEmail = async (order) => {
    try {
        console.log("Preparing to send admin email for order:", order?._id);
        if (!order || !order.orderItems) {
            console.error("Invalid order object passed to sendOrderEmail:", order);
            return false;
        }

        const orderItemsHtml = order.orderItems.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
            </tr>
        `).join('');

        const htmlContent = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #5d4037; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Order Received</h1>
                    <p style="color: #d7ccc8; margin: 5px 0 0 0;">SR Bakery Management System</p>
                </div>
                
                <div style="padding: 30px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #f5f5f5; padding-bottom: 15px;">
                        <div>
                            <span style="color: #888; font-size: 12px; text-transform: uppercase;">Order ID</span><br>
                            <strong style="color: #2c3e50;">#${order._id.toString().toUpperCase()}</strong>
                        </div>
                        <div style="text-align: right;">
                            <span style="color: #888; font-size: 12px; text-transform: uppercase;">Date</span><br>
                            <strong style="color: #2c3e50;">${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</strong>
                        </div>
                    </div>

                    <div style="background-color: #fcfaf7; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #d2691e;">
                        <h3 style="margin-top: 0; color: #5d4037; font-size: 16px;">Customer Details</h3>
                        <p style="margin: 5px 0; color: #444;"><strong>Name:</strong> ${order.shippingAddress.name || 'Valued Customer'}</p>
                        <p style="margin: 5px 0; color: #444;"><strong>Phone:</strong> ${order.shippingAddress.mobileNumber}</p>
                        <p style="margin: 5px 0; color: #444;"><strong>Method:</strong> ${order.paymentMethod} (Successful)</p>
                    </div>

                    <h3 style="color: #5d4037; font-size: 16px; margin-bottom: 15px;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 12px; text-align: left; color: #555; border-bottom: 2px solid #dee2e6;">Item</th>
                                <th style="padding: 12px; text-align: center; color: #555; border-bottom: 2px solid #dee2e6;">Qty</th>
                                <th style="padding: 12px; text-align: right; color: #555; border-bottom: 2px solid #dee2e6;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItemsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 18px; color: #2c3e50;">Total Paid:</td>
                                <td style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 18px; color: #d2691e;">₹${order.totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px;">
                        <h4 style="margin: 0 0 10px 0; color: #555; font-size: 14px; text-transform: uppercase;">Shipping Address</h4>
                        <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                            ${order.shippingAddress.address}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                            India
                        </p>
                    </div>
                </div>

                <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                    This is an automated notification from your SR Bakery Admin Panel.<br>
                    &copy; ${new Date().getFullYear()} SR Bakery. All rights reserved.
                </div>
            </div>
        `;

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Order Received – SR Bakery',
            html: htmlContent
        };

        console.log("Mail Options prepared:", JSON.stringify({ to: mailOptions.to, subject: mailOptions.subject }, null, 2));

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        console.log('Admin Order Email response: ' + info.response);
        return true;
    } catch (error) {
        console.error("Email sending failed:", error);
        return false;
    }
};

/**
 * Send Startup Test Email
 */
const sendStartupTestEmail = async () => {
    try {
        console.log("Sending startup test email...");

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #27ae60; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0;">System Online</h2>
                </div>
                <div style="padding: 30px; text-align: center;">
                    <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
                    <h3 style="color: #2c3e50;">SMTP Configuration Verified!</h3>
                    <p style="color: #7f8c8d; line-height: 1.6;">Your bakery notification system is now correctly connected to Gmail. All future orders will arrive in this inbox with full details.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #bdc3c7;">Sent at: ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: 'Email Test – SR Bakery Notification System',
            html: htmlContent
        };
        await transporter.sendMail(mailOptions);
        console.log("Startup test email sent successfully");
    } catch (error) {
        console.error("Startup test email failed:", error);
    }
};

/**
 * Send Telegram Notification to Admin
 * @param {Object} order - Order details from database
 */
const sendTelegramNotification = async (order) => {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId || chatId === 'your_telegram_chat_id') {
            return false;
        }

        const itemsString = order.orderItems.map(item => `${item.name} x${item.quantity}`).join('\n');

        const message = `New Bakery Order!

Order ID: ${order._id.toString().toUpperCase()}

Customer: ${order.shippingAddress.name || 'Customer'}
Phone: ${order.shippingAddress.mobileNumber}

Address:
${order.shippingAddress.city}, ${order.shippingAddress.postalCode}

Items:
${itemsString}

Total: ₹${order.totalAmount}
Payment: ${order.paymentMethod} Successful `;

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await axios.post(url, {
            chat_id: chatId,
            text: message
        });

        console.log('Telegram notification sent to admin.');
        return true;
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        return false;
    }
};

module.exports = {
    sendOrderEmail,
    sendStartupTestEmail,
    sendTelegramNotification
};
