const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Pilot, User, Insurance } = require('../models');

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

// GET /api/pilots - Get all pilots with filters
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      rating, 
      specialty, 
      certified, 
      available,
      location,
      radius = 50
    } = req.query;
    
    let whereClause = {
      status: 'active'
    };
    
    if (search) {
      whereClause.$or = [
        { businessName: { $iLike: `%${search}%` } },
        { '$user.firstName$': { $iLike: `%${search}%` } },
        { '$user.lastName$': { $iLike: `%${search}%` } }
      ];
    }
    
    if (rating) {
      whereClause.rating = { $gte: parseFloat(rating) };
    }
    
    if (specialty) {
      whereClause.servicesOffered = { $contains: [specialty] };
    }
    
    if (certified === 'true') {
      whereClause.isCertified = true;
    }
    
    if (available === 'true') {
      whereClause.isAvailable = true;
    }

    const pilots = await Pilot.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Insurance,
          as: 'insuranceProfile',
          attributes: ['provider', 'policyNumber', 'coverageAmount', 'expiryDate']
        }
      ],
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']]
    });

    res.json(pilots);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/pilots/:id - Get specific pilot
router.get('/:id', async (req, res) => {
  try {
    const pilot = await Pilot.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'company']
        },
        {
          model: Insurance,
          as: 'insuranceProfile'
        }
      ]
    });

    if (!pilot) {
      return res.status(404).json({ message: 'Pilot not found' });
    }

    res.json(pilot);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/pilots - Create pilot profile
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      businessName,
      businessLicense,
      yearsOfExperience,
      hourlyRate,
      serviceRadius,
      isCertified,
      certificationDate,
      certificationExpiry,
      servicesOffered,
      equipment,
      bio,
      specialties,
      languages
    } = req.body;

    // Check if user already has a pilot profile
    const existingPilot = await Pilot.findOne({ where: { userId: req.user.id } });
    if (existingPilot) {
      return res.status(409).json({ message: 'Pilot profile already exists' });
    }

    const pilot = await Pilot.create({
      userId: req.user.id,
      businessName,
      businessLicense,
      yearsOfExperience,
      hourlyRate,
      serviceRadius,
      isCertified,
      certificationDate,
      certificationExpiry,
      servicesOffered,
      equipment,
      bio,
      specialties,
      languages,
      status: 'pending'
    });

    res.status(201).json(pilot);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/pilots/:id - Update pilot profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const pilot = await Pilot.findByPk(req.params.id);
    
    if (!pilot) {
      return res.status(404).json({ message: 'Pilot not found' });
    }

    if (pilot.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    await pilot.update(req.body);
    res.json(pilot);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/pilots/me/profile - Get current user's pilot profile
router.get('/me/profile', authenticateToken, async (req, res) => {
  try {
    const pilot = await Pilot.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Insurance,
          as: 'insuranceProfile'
        }
      ]
    });

    if (!pilot) {
      return res.status(404).json({ message: 'Pilot profile not found' });
    }

    res.json(pilot);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 