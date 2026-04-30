const express = require('express');
const { validateCoupon, getCoupons, createCoupon, updateCoupon, toggleCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/validate', validateCoupon);

// Admin only
router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.patch('/:id/toggle', protect, admin, toggleCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
