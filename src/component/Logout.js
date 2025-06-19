import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const Logout = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // Clear the authentication token (JWT) from localStorage or sessionStorage
    localStorage.removeItem('authToken'); // or sessionStorage.removeItem('authToken')

    // Redirect the user to the login page or homepage
    navigate('/login'); // You can redirect to any other page, e.g., '/home'
  };

  return (
    <div className="logout-container">
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
