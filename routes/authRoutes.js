const express = require('express');
const { register, login, refresh, getAllUsers, getUserById, updateUserRole, toggleBanUser, deleteUser } = require('../controllers/authController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);

// Admin only
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.put('/users/:id/ban', protect, admin, toggleBanUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
