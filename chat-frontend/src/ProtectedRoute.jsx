import React from 'react';
import { Navigate } from 'react-router-dom';

// Component to protect routes that require authentication
const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
