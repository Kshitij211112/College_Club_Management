const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost
} = require('../controllers/postController');

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id/like', likePost);

// Admin routes (add auth middleware later)
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;