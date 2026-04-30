const express = require('express');
const { getRevenueByDate, getTopProducts, getOrderTrends, getSummary } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, admin, getSummary);
router.get('/revenue', protect, admin, getRevenueByDate);
router.get('/top-products', protect, admin, getTopProducts);
router.get('/order-trends', protect, admin, getOrderTrends);

module.exports = router;
