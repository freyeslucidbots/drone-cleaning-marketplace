const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Insurance, Pilot } = require('../models');

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

// GET /api/insurance/:pilotId - Get pilot insurance info
router.get('/:pilotId', async (req, res) => {
  try {
    const insurance = await Insurance.findOne({
      where: { pilotId: req.params.pilotId }
    });

    if (!insurance) {
      return res.status(404).json({ message: 'Insurance information not found' });
    }

    res.json(insurance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/insurance - Create insurance record
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      provider,
      policyNumber,
      coverageAmount,
      coverageType,
      expiryDate,
      certificateUrl
    } = req.body;

    // Get pilot profile
    const pilot = await Pilot.findOne({ where: { userId: req.user.id } });
    if (!pilot) {
      return res.status(400).json({ message: 'Pilot profile required' });
    }

    // Check if insurance already exists
    const existingInsurance = await Insurance.findOne({
      where: { pilotId: pilot.id }
    });

    if (existingInsurance) {
      return res.status(409).json({ message: 'Insurance record already exists' });
    }

    const insurance = await Insurance.create({
      pilotId: pilot.id,
      provider,
      policyNumber,
      coverageAmount,
      coverageType,
      expiryDate,
      certificateUrl,
      isVerified: false
    });

    res.status(201).json(insurance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/insurance/:id - Update insurance record
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const insurance = await Insurance.findByPk(req.params.id, {
      include: [
        {
          model: Pilot,
          as: 'pilot'
        }
      ]
    });

    if (!insurance) {
      return res.status(404).json({ message: 'Insurance record not found' });
    }

    // Verify user owns the insurance record
    if (insurance.pilot.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }

    await insurance.update(req.body);
    res.json(insurance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/insurance/:id - Delete insurance record
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const insurance = await Insurance.findByPk(req.params.id, {
      include: [
        {
          model: Pilot,
          as: 'pilot'
        }
      ]
    });

    if (!insurance) {
      return res.status(404).json({ message: 'Insurance record not found' });
    }

    // Verify user owns the insurance record
    if (insurance.pilot.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this record' });
    }

    await insurance.destroy();
    res.json({ message: 'Insurance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 