import mongoose from 'mongoose';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://seanleaky:Sean1234.@cluster0.8quzfla.mongodb.net/hotel-app';

async function testAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check for admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`Found ${adminUsers.length} admin users:`);
    
    adminUsers.forEach((user, index) => {
      console.log(`Admin ${index + 1}:`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Role: ${user.role}`);
      console.log(`  - ID: ${user._id}`);
    });

    // Check all users
    const allUsers = await User.find();
    console.log(`\nTotal users: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`User ${index + 1}: ${user.email} (${user.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error testing admin:', error);
    process.exit(1);
  }
}

testAdmin(); 