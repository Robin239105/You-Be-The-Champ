const express = require('express');
const { uploadImage, upload } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), uploadImage);

module.exports = router;
