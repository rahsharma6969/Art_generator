import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/api/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('userId', result.user._id); // Store userId in localStorage
      console.log('User ID stored:', result.user._id); // Log for debugging
      setUser(result.user); // Set the user in the global state
      navigate('/'); // Redirect to home
    } else {
      alert(result.message);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required // Add required attribute
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required // Add required attribute
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
