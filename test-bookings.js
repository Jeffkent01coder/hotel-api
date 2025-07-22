import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import Room from './models/Room.js';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://seanleaky:Sean1234.@cluster0.8quzfla.mongodb.net/hotel-app';

async function testBookings() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check existing bookings
    const bookings = await Booking.find().populate('userId').populate('roomId');
    console.log(`Found ${bookings.length} existing bookings`);
    
    bookings.forEach((booking, index) => {
      console.log(`Booking ${index + 1}:`);
      console.log(`  - ID: ${booking._id}`);
      console.log(`  - Room: ${booking.roomName}`);
      console.log(`  - Date: ${booking.date}`);
      console.log(`  - User: ${booking.userId?.email || 'Unknown'}`);
      console.log(`  - Room ID: ${booking.roomId?._id || 'Unknown'}`);
    });

    // Check if we have rooms and users
    const rooms = await Room.find();
    const users = await User.find();
    console.log(`\nFound ${rooms.length} rooms and ${users.length} users`);

    if (rooms.length > 0 && users.length > 0 && bookings.length === 0) {
      console.log('\nCreating a test booking...');
      
      const testRoom = rooms[0];
      const testUser = users[0];
      
      const testBooking = await Booking.create({
        roomId: testRoom._id,
        userId: testUser._id,
        roomName: testRoom.roomName,
        date: '2024-01-15'
      });
      
      console.log('Test booking created:', testBooking);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error testing bookings:', error);
    process.exit(1);
  }
}

testBookings(); 