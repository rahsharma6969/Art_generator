import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true, // Index for faster querying by post
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for faster querying by user
  },
  content: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
}, {
  timestamps: true, // Adds `createdAt` and `updatedAt` timestamps
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
