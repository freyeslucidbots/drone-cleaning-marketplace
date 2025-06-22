const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { User, Pilot, Payment } = require('../models');

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

// GET /api/subscriptions/plans - Get available subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'basic',
        name: 'Basic',
        price: 29.99,
        features: [
          'Up to 10 job bids per month',
          'Basic profile listing',
          'Email support'
        ]
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 79.99,
        features: [
          'Unlimited job bids',
          'Featured profile listing',
          'Priority customer support',
          'Advanced analytics',
          'Direct messaging with property managers'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 199.99,
        features: [
          'Everything in Premium',
          'Team management',
          'API access',
          'Dedicated account manager',
          'Custom integrations'
        ]
      }
    ];

    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/subscriptions/create-checkout-session - Create Stripe checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;

    // Verify user is a pilot
    if (req.user.role !== 'pilot') {
      return res.status(403).json({ message: 'Only pilots can subscribe' });
    }

    const pilot = await Pilot.findOne({ where: { userId: req.user.id } });
    if (!pilot) {
      return res.status(400).json({ message: 'Pilot profile required' });
    }

    // Get plan details
    const plans = {
      basic: { price: 2999, name: 'Basic Plan' },
      premium: { price: 7999, name: 'Premium Plan' },
      enterprise: { price: 19999, name: 'Enterprise Plan' }
    };

    const plan = plans[planId];
    if (!plan) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/subscription?canceled=true`,
      client_reference_id: req.user.id,
      metadata: {
        planId,
        pilotId: pilot.id
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/subscriptions/webhook - Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleSubscriptionCreated(session);
        break;
      
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handlePaymentSucceeded(invoice);
        break;
      
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        await handlePaymentFailed(failedInvoice);
        break;
      
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionCancelled(subscription);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper functions for webhook handling
async function handleSubscriptionCreated(session) {
  const { planId, pilotId } = session.metadata;
  const pilot = await Pilot.findByPk(pilotId);
  
  if (pilot) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    await pilot.update({
      membershipStatus: planId,
      membershipExpiry: expiryDate,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription
    });
  }
}

async function handlePaymentSucceeded(invoice) {
  const pilot = await Pilot.findOne({
    where: { stripeCustomerId: invoice.customer }
  });
  
  if (pilot) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    await pilot.update({
      membershipExpiry: expiryDate,
      status: 'active'
    });

    // Record payment
    await Payment.create({
      pilotId: pilot.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      stripeInvoiceId: invoice.id,
      status: 'completed'
    });
  }
}

async function handlePaymentFailed(invoice) {
  const pilot = await Pilot.findOne({
    where: { stripeCustomerId: invoice.customer }
  });
  
  if (pilot) {
    await pilot.update({ status: 'suspended' });
  }
}

async function handleSubscriptionCancelled(subscription) {
  const pilot = await Pilot.findOne({
    where: { stripeSubscriptionId: subscription.id }
  });
  
  if (pilot) {
    await pilot.update({
      membershipStatus: 'free',
      status: 'inactive'
    });
  }
}

// GET /api/subscriptions/status - Get current subscription status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const pilot = await Pilot.findOne({
      where: { userId: req.user.id }
    });

    if (!pilot) {
      return res.status(404).json({ message: 'Pilot profile not found' });
    }

    const subscription = {
      status: pilot.membershipStatus,
      expiry: pilot.membershipExpiry,
      isActive: pilot.isMembershipActive(),
      accountStatus: pilot.status
    };

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/subscriptions/cancel - Cancel subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const pilot = await Pilot.findOne({
      where: { userId: req.user.id }
    });

    if (!pilot || !pilot.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.update(pilot.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    res.json({ message: 'Subscription will be cancelled at the end of the current period' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 