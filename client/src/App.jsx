import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Home, CreatePost, LoginPage, SignupPage } from './page';
import CommunityPage  from './page/Communitypage.jsx';
import ProfilePage from './page/ProfilePage';
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Manage dropdown visibility
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Toggle dropdown visibility on hover or click
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <>
      <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
        <nav className="flex w-full justify-between items-center">
          <div className="flex gap-4">
            <Link to="/" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
              Home
            </Link>
            {!user ? (
              <>
                <Link to="/login" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/signup" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/create-post" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
                  Create Post
                </Link>
                <Link to="/community" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
                  Community
                </Link>
              </>
            )}
          </div>

          {/* Profile Button aligned to the right */}
          {user && (
            <div className="relative" onMouseLeave={closeDropdown}>
              <button
                onClick={toggleDropdown} // Show/hide dropdown on click
                className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
                onMouseEnter={() => setDropdownVisible(true)} // Show on hover
              >
                <span>👤 {user.username}</span>
              </button>
              {dropdownVisible && ( // Conditional rendering for dropdown
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
