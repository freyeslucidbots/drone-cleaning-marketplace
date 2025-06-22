const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Job, User, Bid, JobImage } = require('../models');

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

// GET /api/jobs - Get all jobs
router.get('/', async (req, res) => {
  try {
    const { status, propertyType, budgetMin, budgetMax, location } = req.query;
    
    let whereClause = {};
    
    if (status) whereClause.status = status;
    if (propertyType) whereClause.propertyType = propertyType;
    if (budgetMin || budgetMax) {
      whereClause.budget = {};
      if (budgetMin) whereClause.budget.$gte = budgetMin;
      if (budgetMax) whereClause.budget.$lte = budgetMax;
    }

    const jobs = await Job.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'propertyManager',
          attributes: ['id', 'firstName', 'lastName', 'company']
        },
        {
          model: JobImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'caption']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/jobs/:id - Get specific job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'propertyManager',
          attributes: ['id', 'firstName', 'lastName', 'company', 'phone']
        },
        {
          model: JobImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'caption']
        },
        {
          model: Bid,
          as: 'bids',
          include: [
            {
              model: User,
              as: 'pilot',
              include: [
                {
                  model: Pilot,
                  as: 'pilotProfile',
                  attributes: ['businessName', 'rating', 'totalReviews', 'hourlyRate']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/jobs - Create new job
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      propertySize,
      budget,
      location,
      address,
      latitude,
      longitude,
      preferredDate,
      images
    } = req.body;

    const job = await Job.create({
      propertyManagerId: req.user.id,
      title,
      description,
      propertyType,
      propertySize,
      budget,
      location,
      address,
      latitude,
      longitude,
      preferredDate,
      status: 'open'
    });

    // Handle images if provided
    if (images && images.length > 0) {
      const jobImages = images.map(image => ({
        jobId: job.id,
        imageUrl: image.url,
        caption: image.caption
      }));
      await JobImage.bulkCreate(jobImages);
    }

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/jobs/:id - Update job
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.propertyManagerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    await job.update(req.body);
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/jobs/:id - Delete job
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.propertyManagerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.destroy();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 