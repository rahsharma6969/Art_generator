import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'; // Make sure to import body-parser if using it
import userRouter from './src/routes/user.routes.js'; 
import uploadRouter from './src/routes/upload.routes.js'; // Import upload router for uploads
import postRouter from './src/routes/post.routes.js'; // Import post router for post actions
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import prodiarouter from './src/routes/prodia.routes.js';

const app = express();

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Important for requests with credentials (like cookies)
}));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use('/tem', express.static(path.join(__dirname, 'Art_generator/Backend/public/tem'))); // Static files serving

// Routes declaration
app.use("/api/v1/users", userRouter);              // User-related routes
app.use("/api/v1/uploads", uploadRouter);          // Upload-related routes (use for handling file uploads)
app.use("/api/v1/community", postRouter);          // Post-related routes for the community
app.use("/api/v1/prodia", prodiarouter);

export default app;
