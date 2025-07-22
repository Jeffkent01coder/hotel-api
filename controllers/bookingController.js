import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

export const bookRoom = async (req, res, next) => {
  try {
    const { roomId, date } = req.body;
    console.log('Booking room:', roomId, 'for date:', date);
    
    const room = await Room.findById(roomId);
    if (!room) {
      console.log('Room not found:', roomId);
      return res.status(404).json({ message: 'Room not found' });
    }
    
    console.log('Room found:', room.roomName);
    console.log('Current unavailable dates:', room.unavailableDates);
    
    if (room.unavailableDates.includes(date)) {
      console.log('Room already unavailable on:', date);
      return res.status(400).json({ message: 'Room unavailable on this date' });
    }
    
    room.unavailableDates.push(date);
    await room.save();
    console.log('Updated room unavailable dates:', room.unavailableDates);
    
    const booking = await Booking.create({
      roomId,
      userId: req.user._id,
      roomName: room.roomName,
      date
    });
    
    console.log('Booking created:', booking._id);
    res.status(201).json(booking);
  } catch (err) { 
    console.error('Booking error:', err);
    next(err); 
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { roomId, date } = req.body;
    console.log('Cancelling booking for room:', roomId, 'date:', date);
    
    // Find the booking by roomId and date
    const booking = await Booking.findOne({ 
      roomId: roomId, 
      date: date,
      userId: req.user._id 
    });
    
    if (!booking) {
      console.log('Booking not found for room:', roomId, 'date:', date);
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    console.log('Found booking to cancel:', booking._id);
    
    // Update the room's unavailable dates
    const room = await Room.findById(booking.roomId);
    if (room) {
      room.unavailableDates = room.unavailableDates.filter(d => d !== booking.date);
      await room.save();
      console.log('Updated room unavailable dates:', room.unavailableDates);
    }
    
    // Delete the booking
    await booking.deleteOne();
    console.log('Booking cancelled successfully');
    
    res.json({ message: 'Booking cancelled' });
  } catch (err) { 
    console.error('Cancel booking error:', err);
    next(err); 
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id });
    res.json(bookings);
  } catch (err) { next(err); }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    console.log('Getting all bookings with filters - startDate:', startDate, 'endDate:', endDate);
    console.log('User making request:', req.user.email, 'Role:', req.user.role);
    
    let query = {};
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }
    
    console.log('Query:', query);
    
    const bookings = await Booking.find(query)
      .populate('userId', 'email name')
      .populate('roomId', 'roomName');
    
    console.log('Found bookings:', bookings.length);
    bookings.forEach(booking => {
      console.log('Booking:', {
        id: booking._id,
        roomName: booking.roomName,
        date: booking.date,
        user: booking.userId?.email || 'Unknown',
        roomId: booking.roomId?._id || 'Unknown'
      });
    });
    
    res.json(bookings);
  } catch (err) { 
    console.error('Get all bookings error:', err);
    next(err); 
  }
}; 