const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const startOfYear = new Date(today.getFullYear(), 0, 1);

        // Helper to calculate stats for a given period
        const getStatsForPeriod = async (startDate) => {
            const orders = await Order.find({ createdAt: { $gte: startDate } });
            const revenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
            return { count: orders.length, revenue };
        };

        const [statsToday, statsWeek, statsMonth, statsYear] = await Promise.all([
            getStatsForPeriod(today),
            getStatsForPeriod(startOfWeek),
            getStatsForPeriod(startOfMonth),
            getStatsForPeriod(startOfYear)
        ]);

        const totalUsers = await User.countDocuments();

        // Recent Orders (Limit 5)
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

        res.json({
            today: statsToday,
            week: statsWeek,
            month: statsMonth,
            year: statsYear,
            totalUsers,
            recentOrders
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Server Error Fetching Stats' });
    }
};

const getDailyReport = async (req, res) => {
    // Basic implementation for daily aggregation
    // In a real app, this would be more complex or use MongoDB aggregation pipeline
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.find({ createdAt: { $gte: today } });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = orders.length;

    // Estimate expenses (placeholder logic)
    const estimatedExpenses = totalRevenue * 0.6;
    const netProfit = totalRevenue - estimatedExpenses;

    res.json({
        date: today,
        totalOrders,
        totalRevenue,
        estimatedExpenses,
        netProfit
    });
};

const getMonthlyReport = async (req, res) => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const orders = await Order.find({ createdAt: { $gte: firstDay } });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Top selling items (simplified)
    const productSales = {};
    orders.forEach(order => {
        order.orderItems.forEach(item => {
            if (productSales[item.name]) {
                productSales[item.name] += item.quantity;
            } else {
                productSales[item.name] = item.quantity;
            }
        });
    });

    const topSellingItems = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, quantity]) => ({ name, quantity }));

    res.json({
        month: now.toLocaleString('default', { month: 'long' }),
        totalRevenue,
        topSellingItems
    });
};

module.exports = { getDashboardStats, getDailyReport, getMonthlyReport };
