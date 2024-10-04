const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const generateToken = require('../utils/generateToken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback', // The callback route for OAuth
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, displayName } = profile;
        const email = emails[0].value;
        
        let user = await User.findOne({ email });
        
        if (!user) {
          // If user does not exist, create a new user
          user = new User({
            email,
            username: displayName,
            googleId: id,
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
