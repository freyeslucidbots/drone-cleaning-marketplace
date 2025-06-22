const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        len: [10, 15]
      }
    },
    role: {
      type: DataTypes.ENUM('property_manager', 'pilot', 'admin'),
      allowNull: false,
      defaultValue: 'property_manager'
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'US'
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    phoneVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    isLucidSuiteCustomer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  // Instance methods
  User.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  // Class methods
  User.findByEmail = function(email) {
    return this.findOne({ where: { email } });
  };

  User.findActiveUsers = function() {
    return this.findAll({ where: { isActive: true } });
  };

  return User;
}; 