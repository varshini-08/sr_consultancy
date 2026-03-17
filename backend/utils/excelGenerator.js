const XLSX = require('xlsx');

/**
 * Generates an Excel buffer from order data
 * @param {Array} orders - Array of order objects
 * @returns {Buffer} - Excel file buffer
 */
const generateOrdersExcel = (orders) => {
    const data = orders.map(order => ({
        'Order ID': order._id.toString(),
        'Customer': order.user?.name || 'Guest',
        'Email': order.user?.email || 'N/A',
        'Date': new Date(order.createdAt).toLocaleString(),
        'Total Amount': `₹${order.totalAmount}`,
        'Status': order.status,
        'Payment Method': order.paymentMethod,
        'Is Paid': order.isPaid ? 'Yes' : 'No',
        'Items Count': order.orderItems.reduce((acc, item) => acc + item.quantity, 0),
        'Shipping Address': `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Report');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
};

module.exports = { generateOrdersExcel };
