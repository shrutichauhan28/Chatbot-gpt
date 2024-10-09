const express = require('express');
const { login, signup, getUserInfo, addUser, getAllUsers, uploadUsers } = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');

// Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ dest: 'uploads/' }).array('files', 10); 
router.post('/signup', signup);
router.post('/login', login);
router.get('/userinfo', authMiddleware, getUserInfo);
router.post('/adduser', authMiddleware, addUser);
router.get('/users', authMiddleware, getAllUsers);

// Update multer to handle multiple files
// Accept up to 10 files

// Update the route to accept multiple files
router.post('/upload-users', authMiddleware, upload, uploadUsers);


// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/userinfo.profile'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    try {
      const token = generateToken(req.user._id);
      res.redirect(`http://localhost:3000/success?token=${token}`);
    } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      res.redirect('http://localhost:3000/error');
    }
  }
);

// Add a route for retrieving chat history by session ID
router.get('/chat-history', authMiddleware, async (req, res) => {
  try {
    // Assuming you have a Chat model to fetch messages
    const chatHistory = await Chat.find({ sessionId: req.sessionID });
    if (!chatHistory) {
      return res.status(404).json({ message: 'No chat history found for this session' });
    }
    res.json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

module.exports = router;
