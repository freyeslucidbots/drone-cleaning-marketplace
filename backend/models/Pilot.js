module.exports = (sequelize, DataTypes) => {
  const Pilot = sequelize.define('Pilot', {
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
    businessName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    businessLicense: {
      type: DataTypes.STRING,
      allowNull: true
    },
    yearsOfExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 50
      }
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    serviceRadius: {
      type: DataTypes.INTEGER, // in miles
      allowNull: true,
      defaultValue: 50,
      validate: {
        min: 1,
        max: 500
      }
    },
    isCertified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    certificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    certificationExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isLucidSuiteCustomer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lucidSuiteCustomerId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    membershipStatus: {
      type: DataTypes.ENUM('free', 'basic', 'premium', 'enterprise'),
      defaultValue: 'free'
    },
    membershipExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    availabilitySchedule: {
      type: DataTypes.JSONB,
      defaultValue: {
        monday: { available: true, hours: { start: '08:00', end: '18:00' } },
        tuesday: { available: true, hours: { start: '08:00', end: '18:00' } },
        wednesday: { available: true, hours: { start: '08:00', end: '18:00' } },
        thursday: { available: true, hours: { start: '08:00', end: '18:00' } },
        friday: { available: true, hours: { start: '08:00', end: '18:00' } },
        saturday: { available: false, hours: { start: '09:00', end: '17:00' } },
        sunday: { available: false, hours: { start: '09:00', end: '17:00' } }
      }
    },
    servicesOffered: {
      type: DataTypes.ARRAY(DataTypes.ENUM('windows', 'facade', 'roof', 'gutters', 'solar_panels', 'full_exterior')),
      defaultValue: []
    },
    equipment: {
      type: DataTypes.JSONB,
      defaultValue: {
        drones: [],
        cleaningEquipment: [],
        safetyEquipment: []
      }
    },
    insurance: {
      type: DataTypes.JSONB,
      defaultValue: {
        hasInsurance: false,
        provider: null,
        policyNumber: null,
        coverageAmount: null,
        expiryDate: null
      }
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    completedJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalEarnings: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    responseTime: {
      type: DataTypes.INTEGER, // average response time in hours
      defaultValue: 0
    },
    portfolio: {
      type: DataTypes.JSONB,
      defaultValue: {
        images: [],
        videos: [],
        caseStudies: []
      }
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    specialties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['English']
    },
    paymentMethods: {
      type: DataTypes.JSONB,
      defaultValue: {
        creditCard: true,
        bankTransfer: true,
        digitalWallet: false
      }
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'suspended', 'inactive'),
      defaultValue: 'pending'
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    tableName: 'pilots',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['isCertified']
      },
      {
        fields: ['isLucidSuiteCustomer']
      },
      {
        fields: ['membershipStatus']
      },
      {
        fields: ['isAvailable']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['status']
      }
    ]
  });

  // Instance methods
  Pilot.prototype.isCertificationValid = function() {
    if (!this.isCertified || !this.certificationExpiry) {
      return false;
    }
    return new Date() < this.certificationExpiry;
  };

  Pilot.prototype.isMembershipActive = function() {
    if (this.membershipStatus === 'free') {
      return true;
    }
    if (!this.membershipExpiry) {
      return false;
    }
    return new Date() < this.membershipExpiry;
  };

  Pilot.prototype.canBidOnJob = function() {
    return this.isCertificationValid() && 
           this.isMembershipActive() && 
           this.isAvailable && 
           this.status === 'active';
  };

  Pilot.prototype.getAverageRating = function() {
    return this.rating || 0;
  };

  Pilot.prototype.updateRating = function(newRating) {
    const totalRating = (this.rating * this.totalReviews) + newRating;
    this.totalReviews += 1;
    this.rating = totalRating / this.totalReviews;
    return this.save();
  };

  // Class methods
  Pilot.findCertifiedPilots = function() {
    return this.findAll({
      where: {
        isCertified: true,
        status: 'active',
        isAvailable: true
      },
      order: [['rating', 'DESC']]
    });
  };

  Pilot.findLucidSuitePilots = function() {
    return this.findAll({
      where: {
        isLucidSuiteCustomer: true,
        status: 'active'
      },
      order: [['rating', 'DESC']]
    });
  };

  Pilot.findByLocation = function(latitude, longitude, radius = 50) {
    // This would need to be implemented with proper geospatial queries
    // For now, returning all available pilots
    return this.findAll({
      where: {
        isAvailable: true,
        status: 'active'
      },
      order: [['rating', 'DESC']]
    });
  };

  return Pilot;
}; 