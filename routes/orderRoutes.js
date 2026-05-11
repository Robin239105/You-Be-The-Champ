const express = require('express');
const { createOrder, getMyOrders, getOrderById, getOrders, updateOrderStatus, updateTracking, getDashboardStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin only (must come before /:id)
router.get('/stats/summary', protect, admin, getDashboardStats);
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/tracking', protect, admin, updateTracking);

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
