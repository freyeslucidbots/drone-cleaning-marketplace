const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Email, password, first name, and last name are required.' });
    }
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    
    const user = await User.create({ 
      email, 
      password, // Will be hashed by the model hook
      firstName,
      lastName,
      role: role || 'property_manager' 
    });
    
    return res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router; 