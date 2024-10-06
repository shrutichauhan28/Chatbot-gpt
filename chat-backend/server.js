const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
//adding now for gmail authentication
const passport = require('passport');
const session = require('express-session');
require('./config/passport'); // Require Passport config for Google OAuth

require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Allow your frontend
  }));


app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret', // Use a secret from environment variables
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Helps prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
  }
}));
app.use(passport.initialize());
app.use(passport.session());

connectDB();

// Auth routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
