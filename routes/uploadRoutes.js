const express = require('express');
const { uploadImage, uploadLocalImage, upload, uploadMemory } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Cloudinary upload for categories
router.post('/', protect, admin, uploadMemory.single('image'), uploadImage);

// Local disk upload for products
router.post('/local', protect, admin, upload.single('image'), uploadLocalImage);

module.exports = router;
