import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  images: [String],
  roomName: { type: String, required: true },
  roomType: { type: String, required: true },
  roomLocation: { type: String, required: true },
  price: { type: Number, required: true },
  amenities: [String],
  rating: { type: Number, default: 0 },
  description: String,
  unavailableDates: [String]
}, { timestamps: true });

export default mongoose.model('Room', roomSchema); 