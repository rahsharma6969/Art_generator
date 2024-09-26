import express from "express";
import { uploadOnCloudinary } from "../utilies/cloudinary.js"; // Correct spelling of 'utilities'
import Post from '../models/post.models.js';

// Get all posts
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({
      success: false,
      message: 'Fetching posts failed, please try again later',
      error: err.message,
    });
  }
};

// Create a new post
const createPost = async (req, res) => {
  try {
    console.log(req.body);  // Log request body to verify the data

    // Ensure the required fields are present
    if (!req.body.name || !req.body.prompt || !req.body._id) {
      return res.status(400).json({ success: false, message: 'All fields including userId are required' });
    }

    const cloudinaryResult = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      return res.status(500).json({ success: false, message: 'Image upload failed' });
    }

    const newPost = await Post.create({
      name: req.body.name,
      prompt: req.body.prompt,
      photo: cloudinaryResult.secure_url,
      userId: req.user._id  // Assuming _id is the userId
    });

    console.log("Newly created post:", newPost); // Log the post to verify
    res.status(201).json({ success: true, data: newPost });

  } catch (err) {
    console.error("Error creating post:", err.message);
    res.status(400).json({ success: false, message: 'Unable to create post', error: err.message });
  }
};



const likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      if (post.likes.includes(userId)) {
          post.likes = post.likes.filter((id) => id !== userId); // Unlike
      } else {
          post.likes.push(userId); // Like
      }

      await post.save();
      res.status(200).json({ message: 'Post liked/unliked', likes: post.likes.length });
  } catch (error) {
      res.status(500).json({ message: 'Error liking post', error });
  }
};


const commentOnPost = async (req, res) => {
  const { postId } = req.params;
  const { userId, commentText } = req.body;

  try {
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      const comment = {
          user: userId,
          text: commentText,
          createdAt: new Date(),
      };

      post.comments.push(comment);
      await post.save();
      res.status(200).json({ message: 'Comment added', comments: post.comments });
  } catch (error) {
      res.status(500).json({ message: 'Error commenting on post', error });
  }
};



const deletePostById = async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to delete the post by ID
    const deletedPost = await Post.findByIdAndDelete(id);

    // Check if the post was found and deleted
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Successfully deleted
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    // Handle any potential errors
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


const deleteallpost =  async (req, res) => {
  try {
    // Delete all posts for the current user (or all posts in the collection)
    await Post.deleteMany({}); // Add conditions if you want to restrict the deletion (e.g., by userId)
    
    res.status(200).json({ success: true, message: 'All posts deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting posts', error: err.message });
  }
};





export { getUserPosts, createPost , commentOnPost, likePost, deletePostById,deleteallpost  };
