const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, testEmail } = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSettings);
router.put('/', protect, admin, updateSettings);
router.post('/test-email', protect, admin, testEmail);

module.exports = router;
