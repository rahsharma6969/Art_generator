import express from 'express';
import { addComment } from '../controllers/comment.controller.js';

const router = express.Router();

// Route to add a comment to a specific post
router.post('/:postId/comments', addComment); 

export default router;

