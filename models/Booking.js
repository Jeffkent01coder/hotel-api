import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomName: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema); 