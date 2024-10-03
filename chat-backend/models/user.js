

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^.*@valuebound\.com$/, 'Only company-specific emails allowed'],
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'Admin', 'admin', 'intern', 'SDE', 'HR', 'Sales manager', 'Project Manager'],
    default: 'user',
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); // Handle error
  }
});

// Method to check password validity during login
userSchema.methods.isValidPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Exclude password from the response (optionally add more sensitive fields)
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password; // Exclude password
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
