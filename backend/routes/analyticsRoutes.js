const express = require('express');
const router = express.Router();
const { getDashboardStats, getDailyReport, getMonthlyReport } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/daily', protect, admin, getDailyReport);
router.get('/monthly', protect, admin, getMonthlyReport);

module.exports = router;
