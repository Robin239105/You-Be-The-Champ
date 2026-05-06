const express = require('express');
const { getCategories, getCategoryTree, getCategoryByName, importDescriptions, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/by-name/:name', getCategoryByName);

// Admin only routes
router.post('/import-descriptions', protect, admin, importDescriptions);
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
