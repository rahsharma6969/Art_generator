import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom'; // Import Navigate here
import { Home, CreatePost, SignupPage, LoginPage } from './page';
import CommunityPage from './page/Communitypage.jsx';
import ProfilePage from './page/ProfilePage';

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check local storage for user data on initial load
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

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/'); // Navigate to home after login
  };

  return (
    <>
      <Header user={user} handleLogout={handleLogout} />
      <MainContent user={user} onLogin={handleLogin} />
    </>
  );
};

const Header = ({ user, handleLogout }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
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

        {user && (
          <div className="relative" onMouseLeave={closeDropdown}>
            <button
              onClick={toggleDropdown}
              className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
              onMouseEnter={() => setDropdownVisible(true)}
            >
              <span>👤 {user.username}</span>
            </button>
            {dropdownVisible && (
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
  );
};

const MainContent = ({ user, onLogin }) => {
  return (
    <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} /> {/* Pass onLogin here */}
        <Route path="/create-post" element={user ? <CreatePost /> : <Navigate to="/login" />} />
        <Route path="/community" element={user ? <CommunityPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </main>
  );
};

export default App;
