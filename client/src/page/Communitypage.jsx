import React, { useState, useEffect } from "react";
import axios from "axios";
import { likePost, commentOnPost } from "../api";
import Card from "./Card"; 

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // New loading state

  const fetchPosts = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch('http://localhost:8080/api/v1/community/post'); // Adjust this if needed
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched posts:", data); // Log the fetched posts
      setPosts(data.data); // Ensure to set the state with the correct data
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error fetching posts:', error);
      setErrorMessage('Error fetching posts. Please try again later.'); // Update error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      fetchPosts(); // Re-fetch posts after liking
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await commentOnPost(postId, comment);
      fetchPosts(); // Re-fetch posts after commenting
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/community/post/${postId}`);
      fetchPosts(); // Re-fetch posts after deleting
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete('http://localhost:8080/api/v1/community/delete/all-posts', {
        withCredentials: true,
      });
      console.log(response.data.message); // Success message
      setPosts([]); // Clear the posts after deletion
    } catch (error) {
      console.error('Error deleting all posts:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Community Page</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <button
        onClick={handleDeleteAll}
        className="bg-red-500 text-white px-4 py-2 rounded-md mb-6"
      >
        Delete All Posts
      </button>

      {loading ? ( // Show loading state
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post._id}
              post={post}
              handleLike={handleLike}  // Passing handleLike
              handleComment={handleComment}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
