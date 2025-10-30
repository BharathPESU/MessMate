import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'messmate';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: MONGO_DB_NAME });
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash('admin123', 10);
    const qrCodeData = crypto.randomUUID();

    const admin = await User.create({
      name: 'Mess Admin',
      email: 'admin@messmate.com',
      phone: '9999999999',
      rollNumber: 'ADMIN001',
      passwordHash,
      qrCodeData,
      role: 'admin',
      credits: 0
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('\nYou can now login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
