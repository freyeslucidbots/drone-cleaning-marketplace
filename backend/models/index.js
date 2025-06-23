const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for local development if no DATABASE_URL is provided
const databaseUrl = process.env.DATABASE_URL || 'sqlite:./database.sqlite';
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(databaseUrl, {
  dialect: isProduction ? 'postgres' : 'sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: isProduction ? {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  } : undefined,
  dialectOptions: isProduction ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : undefined,
  storage: isProduction ? undefined : './database.sqlite'
});

// Import models
const User = require('./User')(sequelize, Sequelize);
const Job = require('./Job')(sequelize, Sequelize);
const Bid = require('./Bid')(sequelize, Sequelize);
const Pilot = require('./Pilot')(sequelize, Sequelize);
const Payment = require('./Payment')(sequelize, Sequelize);
const Insurance = require('./Insurance')(sequelize, Sequelize);
const LucidSuiteUser = require('./LucidSuiteUser')(sequelize, Sequelize);
const JobImage = require('./JobImage')(sequelize, Sequelize);

// Define associations
User.hasMany(Job, { foreignKey: 'propertyManagerId', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'propertyManagerId', as: 'propertyManager' });

User.hasOne(Pilot, { foreignKey: 'userId', as: 'pilotProfile' });
Pilot.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Pilot.hasMany(Bid, { foreignKey: 'pilotId', as: 'bids' });
Bid.belongsTo(Pilot, { foreignKey: 'pilotId', as: 'pilot' });

Job.hasMany(Bid, { foreignKey: 'jobId', as: 'bids' });
Bid.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

Job.hasMany(JobImage, { foreignKey: 'jobId', as: 'images' });
JobImage.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

Bid.hasOne(Payment, { foreignKey: 'bidId', as: 'payment' });
Payment.belongsTo(Bid, { foreignKey: 'bidId', as: 'bid' });

Pilot.hasMany(Payment, { foreignKey: 'pilotId', as: 'payments' });
Payment.belongsTo(Pilot, { foreignKey: 'pilotId', as: 'pilot' });

Pilot.hasOne(Insurance, { foreignKey: 'pilotId', as: 'insuranceProfile' });
Insurance.belongsTo(Pilot, { foreignKey: 'pilotId', as: 'pilot' });

User.hasOne(LucidSuiteUser, { foreignKey: 'userId', as: 'lucidSuiteProfile' });
LucidSuiteUser.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Job,
  Bid,
  Pilot,
  Payment,
  Insurance,
  LucidSuiteUser,
  JobImage
}; 