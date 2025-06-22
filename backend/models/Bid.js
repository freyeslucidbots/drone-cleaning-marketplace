module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'jobs',
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
    estimatedDuration: {
      type: DataTypes.INTEGER, // in hours
      allowNull: true,
      validate: {
        min: 1
      }
    },
    proposedStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    proposedEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 2000]
      }
    },
    attachments: {
      type: DataTypes.JSONB,
      defaultValue: {
        images: [],
        documents: [],
        videos: []
      }
    },
    inclusions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    exclusions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    warranty: {
      type: DataTypes.INTEGER, // warranty period in days
      allowNull: true,
      validate: {
        min: 0
      }
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn', 'awarded'),
      allowNull: false,
      defaultValue: 'submitted'
    },
    isPriority: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    priorityFee: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
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
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    withdrawnAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    withdrawalReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    awardedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'bids',
    timestamps: true,
    indexes: [
      {
        fields: ['jobId']
      },
      {
        fields: ['pilotId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['amount']
      },
      {
        fields: ['isPriority']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Instance methods
  Bid.prototype.calculateTotals = function() {
    this.totalAmount = parseFloat(this.amount) + (this.priorityFee || 0);
    this.commissionAmount = this.totalAmount * parseFloat(process.env.MARKETPLACE_COMMISSION_RATE || 0.15);
    this.pilotAmount = this.totalAmount - this.commissionAmount;
    return this;
  };

  Bid.prototype.canBeModified = function() {
    return ['submitted', 'under_review'].includes(this.status);
  };

  Bid.prototype.canBeWithdrawn = function() {
    return ['submitted', 'under_review'].includes(this.status);
  };

  Bid.prototype.markAsRead = function() {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  };

  Bid.prototype.accept = function() {
    this.status = 'accepted';
    this.acceptedAt = new Date();
    return this.save();
  };

  Bid.prototype.reject = function(reason) {
    this.status = 'rejected';
    this.rejectedAt = new Date();
    this.rejectionReason = reason;
    return this.save();
  };

  Bid.prototype.withdraw = function(reason) {
    this.status = 'withdrawn';
    this.withdrawnAt = new Date();
    this.withdrawalReason = reason;
    return this.save();
  };

  Bid.prototype.award = function() {
    this.status = 'awarded';
    this.awardedAt = new Date();
    return this.save();
  };

  // Class methods
  Bid.findByJob = function(jobId) {
    return this.findAll({
      where: { jobId },
      order: [['totalAmount', 'ASC'], ['createdAt', 'ASC']]
    });
  };

  Bid.findByPilot = function(pilotId) {
    return this.findAll({
      where: { pilotId },
      order: [['createdAt', 'DESC']]
    });
  };

  Bid.findActiveBids = function() {
    return this.findAll({
      where: {
        status: ['submitted', 'under_review']
      },
      order: [['createdAt', 'DESC']]
    });
  };

  Bid.findAwardedBids = function() {
    return this.findAll({
      where: {
        status: 'awarded'
      },
      order: [['awardedAt', 'DESC']]
    });
  };

  return Bid;
}; 