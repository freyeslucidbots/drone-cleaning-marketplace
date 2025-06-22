'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('property_manager', 'pilot', 'admin'),
        allowNull: false,
        defaultValue: 'property_manager'
      },
      phone: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Pilots table
    await queryInterface.createTable('Pilots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      certificationNumber: {
        type: Sequelize.STRING,
        unique: true
      },
      experience: {
        type: Sequelize.INTEGER // years of experience
      },
      specialties: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      insuranceInfo: {
        type: Sequelize.JSON
      },
      availability: {
        type: Sequelize.JSON
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0
      },
      totalJobs: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Jobs table
    await queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      propertyManagerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.JSON
      },
      buildingType: {
        type: Sequelize.STRING
      },
      buildingHeight: {
        type: Sequelize.INTEGER
      },
      squareFootage: {
        type: Sequelize.INTEGER
      },
      budget: {
        type: Sequelize.DECIMAL(10, 2)
      },
      deadline: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM('open', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'open'
      },
      requirements: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Bids table
    await queryInterface.createTable('Bids', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jobId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Jobs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pilotId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pilots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT
      },
      estimatedDuration: {
        type: Sequelize.INTEGER // in days
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Payments table
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jobId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Jobs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pilotId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pilots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      stripePaymentId: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Insurance table
    await queryInterface.createTable('Insurance', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pilotId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pilots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      policyNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coverageAmount: {
        type: Sequelize.DECIMAL(12, 2)
      },
      expiryDate: {
        type: Sequelize.DATE
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create JobImages table
    await queryInterface.createTable('JobImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jobId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Jobs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      caption: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create LucidSuiteUsers table
    await queryInterface.createTable('LucidSuiteUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      lucidSuiteId: {
        type: Sequelize.STRING,
        unique: true
      },
      subscriptionTier: {
        type: Sequelize.STRING
      },
      robotOperatingMinutes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LucidSuiteUsers');
    await queryInterface.dropTable('JobImages');
    await queryInterface.dropTable('Insurance');
    await queryInterface.dropTable('Payments');
    await queryInterface.dropTable('Bids');
    await queryInterface.dropTable('Jobs');
    await queryInterface.dropTable('Pilots');
    await queryInterface.dropTable('Users');
  }
}; 