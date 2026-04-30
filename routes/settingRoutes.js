const express = require('express');
const { getSettings, updateSetting, getPaymentSettings } = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/payments', getPaymentSettings);

// Admin only
router.get('/', protect, admin, getSettings);
router.post('/', protect, admin, updateSetting);

module.exports = router;
