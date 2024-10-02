const express = require('express');
const { login, signup, getUserInfo, addUser, getAllUsers, uploadUsers } = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');

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


module.exports = router;
