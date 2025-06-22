module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 2000]
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
    propertyType: {
      type: DataTypes.ENUM('residential', 'commercial', 'industrial', 'mixed_use'),
      allowNull: false
    },
    buildingHeight: {
      type: DataTypes.INTEGER, // in feet
      allowNull: true,
      validate: {
        min: 1,
        max: 2000
      }
    },
    squareFootage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'US'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    cleaningType: {
      type: DataTypes.ENUM('windows', 'facade', 'roof', 'gutters', 'solar_panels', 'full_exterior'),
      allowNull: false
    },
    urgency: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    budgetType: {
      type: DataTypes.ENUM('fixed', 'range', 'negotiable'),
      allowNull: false,
      defaultValue: 'negotiable'
    },
    budgetMin: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    budgetMax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    preferredStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimatedDuration: {
      type: DataTypes.INTEGER, // in hours
      allowNull: true,
      validate: {
        min: 1
      }
    },
    specialRequirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    accessNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    safetyRequirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'bidding', 'awarded', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft'
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isLucidSuiteOnly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    awardedBidId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'bids',
        key: 'id'
      }
    },
    awardedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bidCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'jobs',
    timestamps: true,
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['propertyManagerId']
      },
      {
        fields: ['city', 'state']
      },
      {
        fields: ['cleaningType']
      },
      {
        fields: ['urgency']
      },
      {
        fields: ['isLucidSuiteOnly']
      },
      {
        fields: ['latitude', 'longitude']
      }
    ]
  });

  // Instance methods
  Job.prototype.getLocationString = function() {
    return `${this.city}, ${this.state}`;
  };

  Job.prototype.getBudgetRange = function() {
    if (this.budgetType === 'fixed' && this.budget) {
      return `$${this.budget}`;
    } else if (this.budgetType === 'range' && this.budgetMin && this.budgetMax) {
      return `$${this.budgetMin} - $${this.budgetMax}`;
    }
    return 'Negotiable';
  };

  Job.prototype.isActive = function() {
    return ['published', 'bidding'].includes(this.status);
  };

  Job.prototype.canBeBidOn = function() {
    return this.status === 'bidding' && this.isPublic;
  };

  // Class methods
  Job.findActiveJobs = function() {
    return this.findAll({
      where: {
        status: ['published', 'bidding'],
        isPublic: true
      },
      order: [['createdAt', 'DESC']]
    });
  };

  Job.findByLocation = function(city, state) {
    return this.findAll({
      where: {
        city,
        state,
        status: ['published', 'bidding'],
        isPublic: true
      },
      order: [['createdAt', 'DESC']]
    });
  };

  Job.findLucidSuiteJobs = function() {
    return this.findAll({
      where: {
        isLucidSuiteOnly: true,
        status: ['published', 'bidding'],
        isPublic: true
      },
      order: [['createdAt', 'DESC']]
    });
  };

  return Job;
}; 