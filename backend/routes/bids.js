const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Bid, Job, User, Pilot } = require('../models');

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

// GET /api/bids - Get bids (filtered by user role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    
    // If user is a pilot, show their bids
    if (req.user.role === 'pilot') {
      const pilot = await Pilot.findOne({ where: { userId: req.user.id } });
      if (pilot) {
        whereClause.pilotId = pilot.id;
      }
    }
    
    // If user is a property manager, show bids on their jobs
    if (req.user.role === 'property_manager') {
      const jobs = await Job.findAll({ where: { propertyManagerId: req.user.id } });
      const jobIds = jobs.map(job => job.id);
      whereClause.jobId = { $in: jobIds };
    }

    const bids = await Bid.findAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'propertyType', 'budget', 'status']
        },
        {
          model: Pilot,
          as: 'pilot',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/bids/:id - Get specific bid
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id, {
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'propertyManager',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Pilot,
          as: 'pilot',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    res.json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/bids - Create new bid
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { jobId, amount, estimatedDuration, message, proposedStartDate } = req.body;

    // Verify user is a pilot
    if (req.user.role !== 'pilot') {
      return res.status(403).json({ message: 'Only pilots can create bids' });
    }

    // Get pilot profile
    const pilot = await Pilot.findOne({ where: { userId: req.user.id } });
    if (!pilot) {
      return res.status(400).json({ message: 'Pilot profile required to bid' });
    }

    // Check if job exists and is open
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not open for bidding' });
    }

    // Check if pilot already bid on this job
    const existingBid = await Bid.findOne({
      where: { jobId, pilotId: pilot.id }
    });

    if (existingBid) {
      return res.status(409).json({ message: 'You have already bid on this job' });
    }

    const bid = await Bid.create({
      jobId,
      pilotId: pilot.id,
      amount,
      estimatedDuration,
      message,
      proposedStartDate,
      status: 'pending'
    });

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/bids/:id/accept - Accept a bid (property manager only)
router.put('/:id/accept', authenticateToken, async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id, {
      include: [
        {
          model: Job,
          as: 'job'
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Verify user owns the job
    if (bid.job.propertyManagerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to accept this bid' });
    }

    // Update bid status
    await bid.update({ status: 'accepted' });
    
    // Update job status
    await bid.job.update({ status: 'assigned' });
    
    // Reject all other bids for this job
    await Bid.update(
      { status: 'rejected' },
      { 
        where: { 
          jobId: bid.jobId,
          id: { $ne: bid.id }
        }
      }
    );

    res.json({ message: 'Bid accepted successfully', bid });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/bids/:id/reject - Reject a bid (property manager only)
router.put('/:id/reject', authenticateToken, async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id, {
      include: [
        {
          model: Job,
          as: 'job'
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Verify user owns the job
    if (bid.job.propertyManagerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to reject this bid' });
    }

    await bid.update({ status: 'rejected' });
    res.json({ message: 'Bid rejected successfully', bid });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/bids/:id - Cancel/delete bid (pilot only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id, {
      include: [
        {
          model: Pilot,
          as: 'pilot'
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Verify user owns the bid
    if (bid.pilot.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this bid' });
    }

    await bid.destroy();
    res.json({ message: 'Bid deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 