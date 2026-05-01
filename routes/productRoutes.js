const express = require('express');
const { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct,
  updateStock,
  deleteProduct, 
  bulkDeleteProducts,
  bulkUpdateStatus,
  getCategories,
  exportProducts,
  importProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Named routes MUST come before parameterized /:slug
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/export', protect, admin, exportProducts);

router.post('/', protect, admin, createProduct);
router.post('/import', protect, admin, importProducts);
router.post('/bulk-delete', protect, admin, bulkDeleteProducts);
router.post('/bulk-status', protect, admin, bulkUpdateStatus);
router.put('/stock/:id', protect, admin, updateStock);

// Parameterized routes last
router.get('/:slug', getProductBySlug);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
