const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment, Bid, Job, Pilot, User } = require('../models');

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

// GET /api/payments - Get payments for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    
    if (req.user.role === 'pilot') {
      const pilot = await Pilot.findOne({ where: { userId: req.user.id } });
      if (pilot) {
        whereClause.pilotId = pilot.id;
      }
    }

    const payments = await Payment.findAll({
      where: whereClause,
      include: [
        {
          model: Bid,
          as: 'bid',
          include: [
            {
              model: Job,
              as: 'job',
              attributes: ['id', 'title', 'propertyType']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/payments/create-job-payment - Create payment for completed job
router.post('/create-job-payment', authenticateToken, async (req, res) => {
  try {
    const { bidId, successUrl, cancelUrl } = req.body;

    // Verify user is property manager
    if (req.user.role !== 'property_manager') {
      return res.status(403).json({ message: 'Only property managers can create payments' });
    }

    const bid = await Bid.findByPk(bidId, {
      include: [
        {
          model: Job,
          as: 'job'
        },
        {
          model: Pilot,
          as: 'pilot'
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Verify job belongs to user
    if (bid.job.propertyManagerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to pay for this job' });
    }

    // Verify bid is accepted
    if (bid.status !== 'accepted') {
      return res.status(400).json({ message: 'Bid must be accepted before payment' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Job Payment: ${bid.job.title}`,
              description: bid.job.description
            },
            unit_amount: Math.round(bid.amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/dashboard?payment=canceled`,
      metadata: {
        bidId: bid.id,
        jobId: bid.job.id,
        pilotId: bid.pilot.id
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/payments/webhook - Stripe webhook for job payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await handleJobPaymentCompleted(session);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleJobPaymentCompleted(session) {
  const { bidId, jobId, pilotId } = session.metadata;
  
  // Create payment record
  await Payment.create({
    bidId: bidId,
    pilotId: pilotId,
    amount: session.amount_total / 100,
    currency: session.currency,
    stripeSessionId: session.id,
    status: 'completed'
  });

  // Update job status
  await Job.update(
    { status: 'completed' },
    { where: { id: jobId } }
  );

  // Update pilot earnings
  const pilot = await Pilot.findByPk(pilotId);
  if (pilot) {
    await pilot.update({
      totalEarnings: pilot.totalEarnings + (session.amount_total / 100),
      completedJobs: pilot.completedJobs + 1
    });
  }
}

module.exports = router; 