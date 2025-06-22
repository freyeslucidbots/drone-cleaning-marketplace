const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { sequelize, User } = require('./models');

const createAdmin = async () => {
  console.log('--- Starting Admin User Seeding ---');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('Error: Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file.');
    return;
  }

  try {
    await sequelize.sync();

    const [user, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        firstName: 'Admin',
        lastName: 'User',
        password: adminPassword,
        userType: 'admin',
        isVerified: true,
        emailVerifiedAt: new Date(),
      }
    });

    if (created) {
      console.log('✅ Admin user created successfully!');
      console.log(`   Email: ${user.email}`);
    } else {
      console.log('ℹ️ Admin user with this email already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await sequelize.close();
    console.log('--- Seeding Finished ---');
  }
};

createAdmin(); 