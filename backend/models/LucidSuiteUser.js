module.exports = (sequelize, DataTypes) => {
  const LucidSuiteUser = sequelize.define('LucidSuiteUser', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    lucidSuiteCustomerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    lucidSuiteAccountId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subscriptionTier: {
      type: DataTypes.ENUM('basic', 'professional', 'enterprise', 'custom'),
      allowNull: false,
      defaultValue: 'basic'
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'cancelled'),
      allowNull: false,
      defaultValue: 'active'
    },
    subscriptionStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    robotOperatingMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    monthlyROMs: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalROMs: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastROMUpdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    marketplaceAccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    priorityBidding: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    exclusiveJobs: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    apiAccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apiKeyExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    integrationSettings: {
      type: DataTypes.JSONB,
      defaultValue: {
        autoSync: false,
        notifications: true,
        dataSharing: false
      }
    },
    syncStatus: {
      type: DataTypes.ENUM('synced', 'pending', 'failed', 'disabled'),
      defaultValue: 'pending'
    },
    lastSyncAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    syncErrors: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        jobNotifications: true,
        bidNotifications: true,
        paymentNotifications: true,
        marketingEmails: false,
        weeklyReports: true
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'lucid_suite_users',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['lucidSuiteCustomerId']
      },
      {
        fields: ['subscriptionStatus']
      },
      {
        fields: ['subscriptionTier']
      },
      {
        fields: ['marketplaceAccess']
      },
      {
        fields: ['syncStatus']
      }
    ]
  });

  // Instance methods
  LucidSuiteUser.prototype.isSubscriptionActive = function() {
    if (this.subscriptionStatus !== 'active') {
      return false;
    }
    if (this.subscriptionEndDate && new Date() > this.subscriptionEndDate) {
      return false;
    }
    return true;
  };

  LucidSuiteUser.prototype.canAccessMarketplace = function() {
    return this.marketplaceAccess && this.isSubscriptionActive();
  };

  LucidSuiteUser.prototype.canBidOnExclusiveJobs = function() {
    return this.exclusiveJobs && this.canAccessMarketplace();
  };

  LucidSuiteUser.prototype.canUsePriorityBidding = function() {
    return this.priorityBidding && this.canAccessMarketplace();
  };

  LucidSuiteUser.prototype.updateROMs = function(roms) {
    this.robotOperatingMinutes = roms;
    this.lastROMUpdate = new Date();
    return this.save();
  };

  LucidSuiteUser.prototype.addMonthlyROMs = function(roms) {
    this.monthlyROMs += roms;
    this.totalROMs += roms;
    this.lastROMUpdate = new Date();
    return this.save();
  };

  LucidSuiteUser.prototype.generateApiKey = function() {
    const crypto = require('crypto');
    this.apiKey = crypto.randomBytes(32).toString('hex');
    this.apiKeyExpiry = new Date();
    this.apiKeyExpiry.setFullYear(this.apiKeyExpiry.getFullYear() + 1);
    return this.save();
  };

  LucidSuiteUser.prototype.isApiKeyValid = function() {
    if (!this.apiKey || !this.apiKeyExpiry) {
      return false;
    }
    return new Date() < this.apiKeyExpiry;
  };

  // Class methods
  LucidSuiteUser.findActiveSubscriptions = function() {
    return this.findAll({
      where: {
        subscriptionStatus: 'active',
        marketplaceAccess: true
      }
    });
  };

  LucidSuiteUser.findByCustomerId = function(customerId) {
    return this.findOne({
      where: { lucidSuiteCustomerId: customerId }
    });
  };

  LucidSuiteUser.findWithExclusiveAccess = function() {
    return this.findAll({
      where: {
        exclusiveJobs: true,
        subscriptionStatus: 'active'
      }
    });
  };

  LucidSuiteUser.findWithPriorityBidding = function() {
    return this.findAll({
      where: {
        priorityBidding: true,
        subscriptionStatus: 'active'
      }
    });
  };

  return LucidSuiteUser;
}; 