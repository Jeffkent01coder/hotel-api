import mongoose from 'mongoose';
import Room from './models/Room.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://seanleaky:Sean1234.@cluster0.8quzfla.mongodb.net/hotel-app';

async function fixImageUrls() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const rooms = await Room.find();
    console.log(`Found ${rooms.length} rooms to check`);

    for (const room of rooms) {
      let updated = false;
      const fixedImages = room.images.map(img => {
        if (img.includes('localhost')) {
          const fixed = img.replace('localhost', '10.0.2.2');
          console.log(`Fixing URL: ${img} -> ${fixed}`);
          updated = true;
          return fixed;
        }
        return img;
      });

      if (updated) {
        room.images = fixedImages;
        await room.save();
        console.log(`Updated room: ${room.roomName}`);
      }
    }

    console.log('Image URL fix completed');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing image URLs:', error);
    process.exit(1);
  }
}

fixImageUrls(); 