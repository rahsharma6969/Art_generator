// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../index.css';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(''); // State for error message
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(''); // Reset error state

//     try {
//       const response = await fetch('http://localhost:8080/api/v1/users/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ usernameOrEmail: username, password }),
//       });

//       if (!response.ok) {
//         const userData = await response.json();
//         const errorMessage = userData.message || 'Login failed. Please check your credentials.';
//         setError(errorMessage);
//         return;
//       }

//       const userData = await response.json();

//       // Save user data and tokens to local storage
//       localStorage.setItem('user', JSON.stringify(userData.user));
//       localStorage.setItem('accessToken', userData.accessToken);
//       localStorage.setItem('refreshToken', userData.refreshToken);

//       // Debug: Check if tokens are stored correctly
//       console.log("Access Token:", userData.accessToken);
//       console.log("Refresh Token:", userData.refreshToken);

//       // Navigate to the home page after successful login
//       navigate('/'); // Adjust this to your profile route if needed
//     } catch (error) {
//       console.error('Login error:', error);
//       setError('An error occurred. Please try again later.'); // Set error message
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded shadow-md w-80"
//         aria-live="polite" // For accessibility
//       >
//         <h2 className="text-lg font-bold mb-4 text-center">Login</h2>

//         {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}

//         <input
//           type="text"
//           placeholder="Username or Email"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//           className="w-full p-2 border border-gray-300 rounded mb-4"
//           aria-label="Username or Email" // Accessibility improvement
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="w-full p-2 border border-gray-300 rounded mb-4"
//           aria-label="Password" // Accessibility improvement
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white py-2 rounded hover:bg-blue-600 transition duration-200`}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>

//         <div className="mt-4 text-center">
//           <p className="text-sm text-gray-600">
//             Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail: username, password }),
      });

      if (!response.ok) {
        const userData = await response.json();
        const errorMessage = userData.message || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        return;
      }

      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('refreshToken', userData.refreshToken);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
        aria-live="polite"
      >
        <h2 className="text-lg font-bold mb-4 text-center text-teal">Login</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border border-teal rounded mb-4"
          aria-label="Username or Email"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-teal rounded mb-4"
          aria-label="Password"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-teal'} text-white py-2 rounded hover:bg-bright-magenta transition duration-200`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <a href="/register" className="text-bright-magenta hover:underline">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
