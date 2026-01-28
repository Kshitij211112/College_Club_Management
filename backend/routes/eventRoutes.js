const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const protect = require("../middleware/auth.middleware");
const restrictTo = require("../middleware/role.middleware");

// Public routes
router.get('/',protect, getAllEvents);
router.get('/:id',protect, getEventById);

// Admin routes (add auth middleware later)
router.post('/',protect,restrictTo("admin", "club_leader"), createEvent);
router.put('/:id',protect,restrictTo("admin", "club_leader"),updateEvent);
router.delete('/:id',protect,restrictTo("admin", "club_leader"), deleteEvent);

module.exports = router;