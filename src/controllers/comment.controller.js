import Comment from '../models/comment.moldels.js';
import Post from '../models/post.models.js';

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    const newComment = new Comment({
      post: postId,
      user: req.user._id, // Assuming the user is authenticated and stored in `req.user`
      content,
    });

    await newComment.save();

    // Update the corresponding post with the new comment
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};
