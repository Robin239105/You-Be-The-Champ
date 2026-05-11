const express = require('express');
const { getSettings, updateSettings, resetSettings, getPaymentSettings } = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/payments', getPaymentSettings);

// Admin only
router.get('/', protect, admin, getSettings);
router.post('/update', protect, admin, updateSettings);
router.post('/reset', protect, admin, resetSettings);

module.exports = router;
