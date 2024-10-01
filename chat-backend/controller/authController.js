const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');

// Signup
exports.signup = async (req, res) => {
  const { email, username, role, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ email, username, role, password });
    await user.save();

    // Generate token and respond
    const token = generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Signup error:', error); // Log error for debugging
    res.status(400).json({ message: 'Signup failed', error: error.message || error });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate token and respond
    const token = generateToken(user._id);
    console.log('User data:', user); // Log user data
    res.json({ token, user });

  } catch (error) {
    console.error('Login error:', error); // Log error for debugging
    res.status(500).json({ message: 'Login failed', error: error.message || error });
  }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    console.log('User info being sent:', req.user); // Log user info

    // Exclude password or any sensitive information
    const { password: _, ...userData } = req.user.toObject(); // Exclude password
    res.json({ user: userData }); // Send user info without password
  } catch (error) {
    console.error('Get User Info error:', error); // Log error for debugging
    res.status(500).json({ message: 'Failed to fetch user info', error });
  }
};

// Add a new user (admin only)
exports.addUser = async (req, res) => {
  const { email, username, role, password } = req.body;

  try {
    // Ensure the request is coming from an admin user
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to add users' });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const user = new User({
      email,
      username,
      role,
      password: hashedPassword,
    });

    await user.save();

    // Respond with success
    res.status(201).json({ message: 'User added successfully', user });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ message: 'Failed to add user', error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Ensure that only admin can access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to view users' });
    }

    // Fetch all users, excluding passwords
    const users = await User.find({}, '-password');
    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};



