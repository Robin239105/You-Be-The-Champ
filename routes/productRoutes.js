const express = require('express');
const { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getCategories,
  exportProducts,
  importProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/export', protect, admin, exportProducts);
router.get('/:slug', getProductBySlug);

// Admin only routes
router.post('/', protect, admin, createProduct);
router.post('/import', protect, admin, importProducts);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
