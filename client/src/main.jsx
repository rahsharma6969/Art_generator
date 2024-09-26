import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { UserProvider } from './components/Usercontext'; // Adjust the path as necessary

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root using createRoot
root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);
