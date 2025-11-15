const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { connectDB } = require('../config/db');
require('dotenv').config();

const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await connectDB();

    const adminEmail = 'admin@tunisianfreelancers.com';
    const adminPassword = 'Admin@123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Hash password
    const password_hash = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await User.create({
      email: adminEmail,
      password_hash,
      full_name: 'System Administrator',
      role: 'admin',
      phone: '+216 20 000 000',
      location: 'Tunis, Tunisia',
      bio: 'Platform administrator account',
      is_active: true,
      is_verified: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('   ADMIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   User ID:  ${admin._id}`);
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

// Run the script
createAdmin();
