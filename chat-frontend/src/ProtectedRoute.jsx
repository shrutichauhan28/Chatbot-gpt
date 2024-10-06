import React from 'react';
import { Navigate } from 'react-router-dom';

// Component to protect routes that require authentication
const ProtectedRoute = ({ isLoggedIn, children, redirectPath = "/login" }) => {
  return isLoggedIn ? children : <Navigate to={redirectPath} />;
};

export default ProtectedRoute;
