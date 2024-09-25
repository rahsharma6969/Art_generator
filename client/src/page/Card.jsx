import React from "react";

const Card = ({ post, handleLike, handleComment, handleDelete }) => {
  // Log the post object for debugging
  console.log("Post object:", post);

  // Check if post is defined
  if (!post) {
    return <p>Loading...</p>; // Handle undefined state appropriately
  }

  return (
    <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <img 
        src={post.photo} 
        alt={post.description} 
        className="w-full h-48 object-cover mb-2 rounded" 
      />
      <h2 className="font-bold text-lg">{post.title}</h2>
      <p className="text-gray-700">{post.description}</p>
      <div className="mt-4 flex justify-between">
        <button 
          onClick={() => handleLike(post._id)} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Like
        </button>
        <button 
          onClick={() => handleComment(post._id, "Your comment here!")} 
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Comment
        </button>
        <button 
          onClick={() => handleDelete(post._id)} 
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;
