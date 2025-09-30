const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Create a comment
router.post('/comments', commentController.createComment);

// Get comments for a post
router.get('/:postId', commentController.getCommentsByPost);

// Delete a comment
router.delete('/:id', commentController.deleteComment);

module.exports = router;
