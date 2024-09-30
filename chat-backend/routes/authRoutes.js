const express = require('express');

const { login, signup, getUserInfo } = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/userinfo',authMiddleware, getUserInfo);
router.post('/adduser', authMiddleware, authController.addUser);

module.exports = router;
