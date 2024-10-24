import express from "express";
import { getUserPosts, createPost, deletePostById, deleteallpost } from "../controllers/post.controllers.js";
import multer from "multer"; // Assuming you're using multer for file handling
import { verifyJWT } from '../middleware/auth.middleware.js'; // Adjust the path as needed
import { deletePostLimiter } from '../middleware/rateLimiter.middleware.js';


const router = express.Router();

// Multer storage (adjust destination or use Cloudinary)
const upload = multer({ dest: 'uploads/' }); // Temporary storage for file uploads

// Route to fetch all posts
router.get('/post', getUserPosts); // Suggest renaming from 'post' to 'posts' for consistency

// Route to create a new post
router.post('/posts/create', upload.single('photo'), createPost );



// Route to delete a specific post by id
router.delete('/delete/posts/:id', verifyJWT, deletePostLimiter, deletePostById);

// Route to delete all posts
router.delete('/delete/all-posts', verifyJWT, deleteallpost);

export default router;
