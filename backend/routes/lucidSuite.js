const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { LucidSuiteUser, User, Pilot } = require('../models');

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

// GET /api/lucid-suite/connect - Get Lucid Suite connection status
router.get('/connect', authenticateToken, async (req, res) => {
  try {
    const lucidSuiteUser = await LucidSuiteUser.findOne({
      where: { userId: req.user.id }
    });

    if (!lucidSuiteUser) {
      return res.json({ connected: false });
    }

    res.json({
      connected: true,
      lucidSuiteId: lucidSuiteUser.lucidSuiteId,
      integrationDate: lucidSuiteUser.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/lucid-suite/connect - Connect Lucid Suite account
router.post('/connect', authenticateToken, async (req, res) => {
  try {
    const { lucidSuiteId, lucidSuiteEmail } = req.body;

    // Check if already connected
    const existingConnection = await LucidSuiteUser.findOne({
      where: { userId: req.user.id }
    });

    if (existingConnection) {
      return res.status(409).json({ message: 'Already connected to Lucid Suite' });
    }

    // Create connection
    const lucidSuiteUser = await LucidSuiteUser.create({
      userId: req.user.id,
      lucidSuiteId,
      lucidSuiteEmail,
      isActive: true
    });

    // Update user role if they're a property manager
    if (req.user.role === 'property_manager') {
      await User.update(
        { isLucidSuiteCustomer: true },
        { where: { id: req.user.id } }
      );
    }

    res.status(201).json(lucidSuiteUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/lucid-suite/disconnect - Disconnect Lucid Suite account
router.delete('/disconnect', authenticateToken, async (req, res) => {
  try {
    const lucidSuiteUser = await LucidSuiteUser.findOne({
      where: { userId: req.user.id }
    });

    if (!lucidSuiteUser) {
      return res.status(404).json({ message: 'No Lucid Suite connection found' });
    }

    await lucidSuiteUser.destroy();

    // Update user role
    await User.update(
      { isLucidSuiteCustomer: false },
      { where: { id: req.user.id } }
    );

    res.json({ message: 'Lucid Suite connection removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/lucid-suite/pilots - Get Lucid Suite pilots
router.get('/pilots', async (req, res) => {
  try {
    const pilots = await Pilot.findAll({
      where: { isLucidSuiteCustomer: true, status: 'active' },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['rating', 'DESC']]
    });

    res.json(pilots);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 