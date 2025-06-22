const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Pilot } = require('../models');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// GET /api/users/profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Pilot,
          as: 'pilotProfile',
          attributes: { exclude: ['userId'] }
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, company } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      company: company || user.company
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/users/subscription
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Pilot,
          as: 'pilotProfile',
          attributes: ['membershipStatus', 'membershipExpiry']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subscription = {
      status: user.pilotProfile?.membershipStatus || 'free',
      expiry: user.pilotProfile?.membershipExpiry,
      isActive: user.pilotProfile?.isMembershipActive?.() || true
    };

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 