module.exports = (sequelize, DataTypes) => {
  const Insurance = sequelize.define('Insurance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    pilotId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'pilots',
        key: 'id'
      }
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false
    },
    policyNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    policyType: {
      type: DataTypes.ENUM('general_liability', 'professional_liability', 'commercial_auto', 'workers_comp', 'comprehensive'),
      allowNull: false
    },
    coverageAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    deductible: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    premium: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    billingCycle: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'annually'),
      allowNull: true
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verificationMethod: {
      type: DataTypes.ENUM('manual', 'api', 'document_upload'),
      allowNull: true
    },
    documents: {
      type: DataTypes.JSONB,
      defaultValue: {
        policyDocument: null,
        certificateOfInsurance: null,
        additionalDocuments: []
      }
    },
    coverageDetails: {
      type: DataTypes.JSONB,
      defaultValue: {
        droneOperations: false,
        propertyDamage: false,
        bodilyInjury: false,
        completedOperations: false,
        personalInjury: false,
        advertisingInjury: false,
        medicalPayments: false
      }
    },
    exclusions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    endorsements: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    claimsHistory: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    partnerProviderId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    partnerPolicyId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    affiliateRevenue: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    affiliateRevenueShare: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: true,
      validate: {
        min: 0,
        max: 1
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'insurance',
    timestamps: true,
    indexes: [
      {
        fields: ['pilotId']
      },
      {
        fields: ['provider']
      },
      {
        fields: ['policyType']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['isVerified']
      },
      {
        fields: ['expiryDate']
      },
      {
        fields: ['partnerProviderId']
      }
    ]
  });

  // Instance methods
  Insurance.prototype.isValid = function() {
    if (!this.isActive || !this.isVerified) {
      return false;
    }
    return new Date() < this.expiryDate;
  };

  Insurance.prototype.daysUntilExpiry = function() {
    const today = new Date();
    const expiry = new Date(this.expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  Insurance.prototype.isExpiringSoon = function(days = 30) {
    return this.daysUntilExpiry() <= days;
  };

  Insurance.prototype.verify = function(method = 'manual') {
    this.isVerified = true;
    this.verificationDate = new Date();
    this.verificationMethod = method;
    return this.save();
  };

  Insurance.prototype.addClaim = function(claim) {
    if (!this.claimsHistory) {
      this.claimsHistory = [];
    }
    this.claimsHistory.push({
      ...claim,
      date: new Date().toISOString()
    });
    return this.save();
  };

  // Class methods
  Insurance.findActivePolicies = function() {
    return this.findAll({
      where: {
        isActive: true,
        isVerified: true,
        expiryDate: {
          [sequelize.Op.gt]: new Date()
        }
      }
    });
  };

  Insurance.findExpiringSoon = function(days = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    return this.findAll({
      where: {
        isActive: true,
        isVerified: true,
        expiryDate: {
          [sequelize.Op.between]: [new Date(), expiryDate]
        }
      }
    });
  };

  Insurance.findByProvider = function(provider) {
    return this.findAll({
      where: { provider }
    });
  };

  Insurance.findPartnerPolicies = function() {
    return this.findAll({
      where: {
        partnerProviderId: {
          [sequelize.Op.not]: null
        }
      }
    });
  };

  return Insurance;
}; 