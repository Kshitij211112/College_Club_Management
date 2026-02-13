const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration
} = require('../controllers/eventController');

const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Private routes (auth checked inside controller for president/admin)
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

// Registration routes
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);

module.exports = router;