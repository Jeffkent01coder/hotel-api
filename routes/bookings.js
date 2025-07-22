import express from 'express';
import { bookRoom, cancelBooking, getUserBookings, getAllBookings } from '../controllers/bookingController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';
const router = express.Router();

router.post('/book', authenticate, bookRoom);
router.post('/cancel', authenticate, cancelBooking);
router.get('/my', authenticate, getUserBookings);
router.get('/all', authenticate, isAdmin, getAllBookings);

export default router; 