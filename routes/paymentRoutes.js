const express = require('express');
const { createStripeSession, handleStripeWebhook, capturePayPalPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe Checkout Session
router.post('/create-checkout-session', protect, createStripeSession);

// PayPal Capture
router.post('/paypal-capture', protect, capturePayPalPayment);

// Webhook (needs raw body in server.js)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
