import fs from 'fs'; // Import fs module
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Post from '../models/post.models.js'; // Import the Post model
import { createPost } from '../controllers/post.controllers.js'; // Ensure correct path

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure the directory exists
const uploadDir = path.join(__dirname, '../public/tem');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the uploadDir variable
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Ensure unique filenames
  },
});

const upload = multer({ 
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
});

// Route for handling post creation
router.post('/create', upload.single('uploadedPhoto'), createPost );

export default router;
