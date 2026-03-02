const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. SETUP ROUTE (To create your initial staff accounts via Thunder Client)
router.post('/setup', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Check if username is already taken
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Username already exists' });

    // Hash the password (even offline, we don't save plain text passwords!)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'Staff'
    });

    await newUser.save();
    res.status(201).json({ message: `Account for ${username} created successfully!` });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// 2. LOGIN ROUTE (For the React Frontend)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    // Check if the password matches
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid username or password' });

    // Create a login token (Expires in 8 hours for a standard shift)
    // Note: We use a simple secret key here since it's a local offline system
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, 
      'barangay_secret_key', 
      { expiresIn: '8h' }
    );

    // Send the token and user data back to the frontend
    res.json({ 
      message: 'Login successful', 
      token, 
      user: { username: user.username, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

module.exports = router;