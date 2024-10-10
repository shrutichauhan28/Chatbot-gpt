const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract token from "Authorization" header
  console.log(`Received token ${token}`);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Authorization required' });
  }

  try {
    // Verify token with secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log the decoded token
    
    // Find the user by decoded ID and exclude the password
    req.user = await User.findById(decoded.id).select('-password');
    console.log('Authenticated User:', req.user); // Log the user
    
    // Check if user exists
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    next(); // Proceed to the next middleware/route handler

  } catch (error) {
    // Handle different types of JWT errors
    if (error.name === 'TokenExpiredError') {
      console.error('Token has expired:', error);
      return res.status(401).json({ message: 'Token expired, please login again' });
    } else if (error.name === 'JsonWebTokenError') {
      console.error('Invalid token:', error);
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Token verification failed' });
    }
  }
};

module.exports = authMiddleware;
