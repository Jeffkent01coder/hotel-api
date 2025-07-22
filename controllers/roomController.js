import Room from '../models/Room.js';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://10.0.2.2:5000';
const DEFAULT_IMAGE = `${BASE_URL}/uploads/default.jpg`;

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    console.log('Found rooms in DB:', rooms.length);
    console.log('BASE_URL being used:', BASE_URL);

    const mappedRooms = rooms.map(room => {
      const obj = room.toObject();
      obj.id = obj._id;
      delete obj._id;
      delete obj.__v;

      console.log('Original images in DB:', obj.images);

      obj.images = (obj.images || []).map(img => {
        let finalUrl;
        if (img.startsWith('http')) {
          // If it's already a full URL, check if it's localhost and fix it
          if (img.includes('localhost')) {
            finalUrl = img.replace('localhost', '10.0.2.2');
            console.log(`Fixed localhost URL: ${img} -> ${finalUrl}`);
          } else {
            finalUrl = img;
          }
        } else {
          // It's a filename, convert to full URL
          finalUrl = `${BASE_URL}/uploads/${img}`;
          console.log(`Converted filename to URL: ${img} -> ${finalUrl}`);
        }
        return finalUrl;
      });

      if (!obj.images || obj.images.length === 0) {
        obj.images = [DEFAULT_IMAGE];
        console.log('No images found, using default:', DEFAULT_IMAGE);
      }

      console.log('Final images for room:', obj.roomName, ':', obj.images);
      return obj;
    });

    console.log('Sending rooms to frontend with proper URLs');
    res.json(mappedRooms);
  } catch (err) { next(err); }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    const obj = room.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    
    obj.images = (obj.images || []).map(img => {
      let finalUrl;
      if (img.startsWith('http')) {
        if (img.includes('localhost')) {
          finalUrl = img.replace('localhost', '10.0.2.2');
          console.log(`Fixed localhost URL: ${img} -> ${finalUrl}`);
        } else {
          finalUrl = img;
        }
      } else {
        // It's a filename, convert to full URL
        finalUrl = `${BASE_URL}/uploads/${img}`;
        console.log(`Converted filename to URL: ${img} -> ${finalUrl}`);
      }
      return finalUrl;
    });
    
    if (!obj.images || obj.images.length === 0) {
      obj.images = [DEFAULT_IMAGE];
    }
    res.json(obj);
  } catch (err) { next(err); }
};

export const createRoom = async (req, res, next) => {
  try {
    const { roomName, roomType, roomLocation, price, amenities, rating, description, unavailableDates } = req.body;

    console.log('Creating room:', roomName);
    console.log('Files received:', req.files ? req.files.length : 0);

    let images = [];
    if (req.files && req.files.length > 0) {
      // Store only the filename, not the full path
      images = req.files.map(file => {
        console.log('File uploaded:', file.filename);
        return file.filename; // Store just the filename
      });
    }

    if (!images || images.length === 0) {
      images = ['default.jpg']; // Store just the filename
      console.log('Using default image: default.jpg');
    }

    console.log('Final images array:', images);

    const amenitiesArray = Array.isArray(amenities)
      ? amenities
      : (typeof amenities === 'string' ? amenities.split(',') : []);
    const unavailableDatesArray = Array.isArray(unavailableDates)
      ? unavailableDates
      : (typeof unavailableDates === 'string' ? unavailableDates.split(',') : []);

    const room = await Room.create({
      roomName, roomType, roomLocation, price, amenities: amenitiesArray,
      rating, description, unavailableDates: unavailableDatesArray, images
    });

    // Return the room with proper image URLs
    const roomObj = room.toObject();
    roomObj.id = roomObj._id;
    delete roomObj._id;
    delete roomObj.__v;

    // Convert filenames to full URLs for response
    roomObj.images = roomObj.images.map(img => {
      if (img.startsWith('http')) {
        return img; // Already a full URL
      } else {
        return `${BASE_URL}/uploads/${img}`;
      }
    });

    console.log('Room created with images:', roomObj.images);
    res.status(201).json(roomObj);
  } catch (err) { next(err); }
};

export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) { next(err); }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted' });
  } catch (err) { next(err); }
};

export const uploadRoomImages = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map(f => f.path) : [];
    res.json({ images });
  } catch (err) { next(err); }
};