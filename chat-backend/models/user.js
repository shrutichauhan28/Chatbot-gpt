const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^.*@valuebound\.com$/, 'Only company-specific emails allowed'],
  },
  username: { type: String, required: true },
  role: { type: String, enum: ['user', 'Admin', 'admin','intern','SDE','HR','Sales manager','Project Manager'], default: 'user' },
  password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
