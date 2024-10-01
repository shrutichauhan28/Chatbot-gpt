const express = require('express');

// const { login, signup, getUserInfo } = require('../controller/authController');
const { login, signup, getUserInfo, addUser, getAllUsers } = require('../controller/authController');

const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/userinfo',authMiddleware, getUserInfo);
// router.post('/adduser', authMiddleware, authController.addUser);
// router.get('/users', authMiddleware, authController.getAllUsers);
router.post('/adduser', authMiddleware, addUser); // Make sure addUser is imported and used
router.get('/users', authMiddleware, getAllUsers);


module.exports = router;
