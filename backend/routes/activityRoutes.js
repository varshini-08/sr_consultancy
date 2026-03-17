const express = require('express');
const router = express.Router();
const { createActivity, getMyActivities, getActivities } = require('../controllers/activityController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createActivity)
    .get(protect, admin, getActivities); // Admin only GET all

router.route('/myactivities').get(protect, getMyActivities);

module.exports = router;
