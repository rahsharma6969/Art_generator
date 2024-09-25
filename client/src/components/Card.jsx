import React from "react";

const Card = ({ post, handleLike, handleComment, handleDelete }) => {
  // Log the post object for debugging
  console.log("Post object:", post);

  // Check if post is defined
  if (!post) {
    return <p>Loading...</p>; // Or handle undefined state appropriately
  }

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <img src={post.photo} alt={post.description} className="w-full h-48 object-cover mb-2" />
      <h2 className="font-bold">{post.title}</h2>
      <p>{post.description}</p>
      <button onClick={() => handleLike(post._id)}>Like</button>
      <button onClick={() => handleComment(post._id, "Your comment here!")}>Comment</button>
      <button onClick={() => handleDelete(post._id)}>Delete</button>
    </div>
  );
};

export default Card;
