// Helper function to save users from parsed data
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');

// Signup
exports.signup = async (req, res) => {
  const { email, username, role, password } = req.body;
      
  console.log("user  hu jbvdbv" ,  pasword);


  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    console.log(hashedPassword);
    const user = new User({ email, username, role, password: hashedPassword });
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

  console.log("hihib")
  console.log("hi" )
  

  const  password  = req.body.password;
  const email = req.body.email;


  try {
    // Find user by email

    console.log("above ")
    const user = await User.findOne({ email });
    // console.log('Searching for user with email:', email.toLowerCase());
    if (!user) return res.status(400).json({ message: `Invalid email or  ${password}` });
    
    
    // Compare passwords
    console.log('User found:', user);

    const isMatch = await bcrypt.compare(password, user.password);


   
    console.log('Password match:', isMatch); 
    
   

     

    if (!isMatch) {
      console.log(`Password mismatch for email: ${email}`);  // Add this log
      return res.status(400).json({ message: 'Invalid emailopppppppr password' });}

    // Generate token and respond
    const token = generateToken(user._id);

    // user.sessionId = token;
    // await user.save(); // Save the sessionId in the database
    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error); // Log error for debugging
    res.status(500).json({ message: 'Login failed', error: error.message || error });
  }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    const { password: _, ...userData } = req.user.toObject(); // Exclude password
    res.json({ user: userData }); // Send user info without password
  } catch (error) {
    console.error('Get User Info error:', error); // Log error for debugging
    res.status(500).json({ message: 'Failed to get user info', error: error.message || error });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error); // Log error for debugging
    res.status(500).json({ message: 'Failed to fetch users', error: error.message || error });
  }
};

// Add User
exports.addUser = async (req, res) => {
  const { email, username, role, password } = req.body;

  try {
    // Validate the email domain
    if (!email.endsWith('@valuebound.com')) {
      return res.status(400).json({ message: 'Email must end with @valuebound.com' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, role, password: hashedPassword });
    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ message: 'Failed to add user', error: error.message || error });
  }
};

// Upload Users from CSV/Excel
exports.uploadUsers = async (req, res) => {
  try {
    console.log('Upload users request received. File:', req.files);

    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Loop through each file uploaded
    const file = req.files[0]; // Assuming single file for now

    const filePath = file.path;
    const ext = file.originalname.split('.').pop();

    if (ext === 'csv') {
      // Process CSV file
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          console.log('CSV data processed:', results); // Log parsed CSV data
          await saveUsersFromData(results, res);
          fs.unlinkSync(filePath); // Delete the file after processing
        });
    } else if (ext === 'xlsx') {
      // Process Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      await saveUsersFromData(sheetData, res);
      fs.unlinkSync(filePath); // Delete the file after processing
    } else {
      console.log('Unsupported file type:', ext);
      return res.status(400).json({ message: 'Unsupported file type' });
    }
  } catch (error) {
    console.error('Upload users error:', error);
    res.status(500).json({ message: 'Failed to upload users', error: error.message || error });
  }
};

const saveUsersFromData = async (data, res) => {
  try {
    const usersToSave = [];

    for (const userData of data) {
      const { email, username, role } = userData;

      // Check if email is present
      if (!email) {
        console.error('Missing email in record:', userData);
        continue; // Skip if email is missing
      }

      // Validate the email domain
      if (!email.endsWith('@valuebound.com')) {
        console.log(`Skipping user with invalid email domain: ${email}`);
        continue; // Skip users with invalid email domains
      }

      const userExists = await User.findOne({ email });
      if (!userExists) {
        // If user doesn't exist, hash password and prepare to save
        const hashedPassword = await bcrypt.hash('defaultPassword123', 10); // Default password
        usersToSave.push({ email, username, role, password: hashedPassword });
      }
    }

    if (usersToSave.length > 0) {
      await User.insertMany(usersToSave); // Save all users at once
      res.status(201).json({ message: 'Users uploaded successfully' });
    } else {
      res.status(400).json({ message: 'No valid users to upload' });
    }
  } catch (error) {
    console.error('Error saving users from data:', error);
    res.status(500).json({ message: 'Failed to save users', error: error.message || error });
  }
};

