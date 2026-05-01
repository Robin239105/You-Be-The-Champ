const express = require('express');
const { getPosts, getPostBySlug, createPost, updatePost, deletePost, bulkDeletePosts, bulkPublishPosts } = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getPosts);
router.post('/bulk-delete', protect, admin, bulkDeletePosts);
router.post('/bulk-publish', protect, admin, bulkPublishPosts);
router.get('/:slug', getPostBySlug);
router.post('/', protect, admin, createPost);
router.put('/:id', protect, admin, updatePost);
router.delete('/:id', protect, admin, deletePost);

module.exports = router;
