import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the current user's uploaded posts
 
    useEffect(() => {
      const fetchUserPosts = async () => {
        const userId = localStorage.getItem('userId'); // Make sure this matches your actual storage key
    
        if (!userId) {
          console.error('User ID is not available');
          return; // Exit if userId is not found
        }
    
        console.log("Fetching posts for userId:", userId); // Log the userId
    
        try {
          const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/posts`);
          console.log("Response status:", response.status); // Log response status
    
          if (!response.ok) {
            throw new Error('Failed to fetch user posts');
          }
          
          const data = await response.json();
          console.log('User posts:', data.posts); // Handle the fetched posts as needed
          setUserPosts(data.posts); // Set the fetched posts in the state
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      };
    
      fetchUserPosts();
    }, []);
    
   // Run effect only once on component mount

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return (
    <section className="profile-page">
      <h1>Your Uploaded Images</h1>
      <div className="image-gallery">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post._id} className="image-card">
              <img src={post.photo} alt={post.prompt} />
              <p>{post.prompt}</p>
            </div>
          ))
        ) : (
          <p>You haven't uploaded any images yet.</p> // Message when there are no posts
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
