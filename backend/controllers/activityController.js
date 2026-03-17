const Activity = require('../models/Activity');

// @desc    Create a new activity log
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res) => {
    try {
        const { action, details } = req.body;

        const activity = new Activity({
            user: req.user._id,
            action,
            details
        });

        const createdActivity = await activity.save();
        res.status(201).json(createdActivity);
    } catch (error) {
        res.status(500).json({ message: 'Error logging activity' });
    }
};

// @desc    Get logged in user's activities
// @route   GET /api/activities/myactivities
// @access  Private
const getMyActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities' });
    }
};

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private/Admin
const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities' });
    }
};

module.exports = { createActivity, getMyActivities, getActivities };
