module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bidId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'bids',
        key: 'id'
      }
    },
    pilotId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'pilots',
        key: 'id'
      }
    },
    propertyManagerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USD'
    },
    paymentType: {
      type: DataTypes.ENUM('job_payment', 'membership_fee', 'priority_fee', 'commission', 'refund'),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('credit_card', 'bank_transfer', 'digital_wallet', 'stripe', 'paypal'),
      allowNull: false
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripeChargeId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'),
      allowNull: false,
      defaultValue: 'pending'
    },
    commissionAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    pilotAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    platformFee: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    processingFee: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    indexes: [
      {
        fields: ['bidId']
      },
      {
        fields: ['pilotId']
      },
      {
        fields: ['propertyManagerId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['paymentType']
      },
      {
        fields: ['stripePaymentIntentId']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Instance methods
  Payment.prototype.calculateTotals = function() {
    this.pilotAmount = this.amount - this.commissionAmount - (this.platformFee || 0) - (this.processingFee || 0);
    return this;
  };

  Payment.prototype.markAsCompleted = function() {
    this.status = 'completed';
    this.processedAt = new Date();
    return this.save();
  };

  Payment.prototype.markAsFailed = function(reason) {
    this.status = 'failed';
    this.failureReason = reason;
    return this.save();
  };

  Payment.prototype.refund = function(amount, reason) {
    this.status = 'refunded';
    this.refundAmount = amount || this.amount;
    this.refundReason = reason;
    this.refundedAt = new Date();
    return this.save();
  };

  // Class methods
  Payment.findByPilot = function(pilotId) {
    return this.findAll({
      where: { pilotId },
      order: [['createdAt', 'DESC']]
    });
  };

  Payment.findByPropertyManager = function(propertyManagerId) {
    return this.findAll({
      where: { propertyManagerId },
      order: [['createdAt', 'DESC']]
    });
  };

  Payment.findCompletedPayments = function() {
    return this.findAll({
      where: { status: 'completed' },
      order: [['processedAt', 'DESC']]
    });
  };

  Payment.findPendingPayments = function() {
    return this.findAll({
      where: { status: 'pending' },
      order: [['createdAt', 'ASC']]
    });
  };

  return Payment;
}; 