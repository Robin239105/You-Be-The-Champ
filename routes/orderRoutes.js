const express = require('express');
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, updateOrderTracking, getDashboardStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin only (must come before /:id)
router.get('/stats/summary', protect, admin, getDashboardStats);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/tracking', protect, admin, updateOrderTracking);

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
