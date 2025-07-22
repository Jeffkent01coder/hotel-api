import express from 'express';
import { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, uploadRoomImages } from '../controllers/roomController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
const router = express.Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', authenticate, isAdmin, upload.array('images', 6), createRoom);
router.put('/:id', authenticate, isAdmin, updateRoom);
router.delete('/:id', authenticate, isAdmin, deleteRoom);
router.post('/upload', authenticate, isAdmin, upload.array('images', 6), uploadRoomImages);

export default router; 