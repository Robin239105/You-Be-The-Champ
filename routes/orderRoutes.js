const express = require('express');
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, getDashboardStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin only
router.get('/', protect, admin, getAllOrders);
router.get('/stats/summary', protect, admin, getDashboardStats);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
