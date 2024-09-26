import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      const userId = localStorage.getItem('userId'); // Get userId from local storage
      if (!userId) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/profile`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile details');
        }
        const data = await response.json();
        setUserData(data.user); // Set user details
        setUserPosts(data.posts); // Set user posts
        console.log('User Posts:', data.posts); // Log the fetched posts
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error fetching profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="profile-page">
      <h1>Profile</h1>

      {/* Display user details */}
      {userData && (
        <div className="user-details">
          <h2>{userData.fullName}</h2>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>Joined: {new Date(userData.createdAt).toLocaleDateString()}</p>
        </div>
      )}

      {/* Display user's uploaded posts */}
      <div className="user-posts">
        <h2>Your Uploaded Images</h2>
        {userPosts.length > 0 ? (
          <div className="image-gallery">
            {userPosts.map((post) => (
              <div key={post._id} className="image-card">
                <img 
                  src={post.photo} // Make sure this is the correct field
                  alt={post.prompt} 
                  onError={(e) => { e.target.src = '/placeholder.png'; }} // Handle image load error
                  style={{ maxWidth: '100%', height: 'auto' }} // Ensure image fits the card
                />
                <p>{post.prompt}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't uploaded any images yet.</p>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
