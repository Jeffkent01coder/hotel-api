import mongoose from 'mongoose';
import Room from './models/Room.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://seanleaky:Sean1234.@cluster0.8quzfla.mongodb.net/hotel-app';

async function fixImagePaths() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const rooms = await Room.find();
    console.log(`Found ${rooms.length} rooms to check`);

    for (const room of rooms) {
      let updated = false;
      const fixedImages = room.images.map(img => {
        // Check if image path contains full file system path
        if (img.includes('C:/Users/') || img.includes('\\Users\\')) {
          // Extract just the filename from the full path
          const filename = img.split('/').pop() || img.split('\\').pop();
          const fixed = `uploads/${filename}`;
          console.log(`Fixing full path: ${img} -> ${fixed}`);
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

    console.log('Image path fix completed');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing image paths:', error);
    process.exit(1);
  }
}

fixImagePaths(); 