import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import User from './models/User.js';
import Room from './models/Room.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://seanleaky:Sean1234.@cluster0.8quzfla.mongodb.net/hotel-app';

async function testApiResponse() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Simulate the getAllBookings query
    const bookings = await Booking.find()
      .populate('userId', 'email name')
      .populate('roomId', 'roomName');
    
    console.log('Raw bookings from database:');
    bookings.forEach((booking, index) => {
      console.log(`\nBooking ${index + 1}:`);
      console.log('  Raw booking object:', JSON.stringify(booking, null, 2));
      console.log('  userId field type:', typeof booking.userId);
      console.log('  userId value:', booking.userId);
      console.log('  userId.email:', booking.userId?.email);
      console.log('  roomId field type:', typeof booking.roomId);
      console.log('  roomId value:', booking.roomId);
    });

    // Convert to JSON to see what the API actually returns
    const jsonBookings = bookings.map(booking => booking.toObject());
    console.log('\nJSON response that API would send:');
    jsonBookings.forEach((booking, index) => {
      console.log(`\nBooking ${index + 1} JSON:`);
      console.log(JSON.stringify(booking, null, 2));
    });

    process.exit(0);
  } catch (error) {
    console.error('Error testing API response:', error);
    process.exit(1);
  }
}

testApiResponse(); 