const express = require('express');
const {
  getMyStats,
  trackClick,
  getAllAffiliates,
  getAllCommissions,
  updateCommissionStatus,
} = require('../controllers/affiliateController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// User-facing
router.get('/me', protect, getMyStats);
router.post('/click', trackClick);

// Admin
router.get('/admin/list', protect, admin, getAllAffiliates);
router.get('/admin/commissions', protect, admin, getAllCommissions);
router.patch('/admin/commissions/:id', protect, admin, updateCommissionStatus);

module.exports = router;
