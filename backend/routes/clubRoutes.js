const express = require('express');
const router = express.Router();
const {
    getAllClubs,
    getMyClubs,
    joinClub,
    getClubById,
    createClub,
    updateClub,
    deleteClub,
    changePresident
} = require('../controllers/clubController');
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Public
router.get('/', getAllClubs);

// Private
router.get('/my-clubs', protect, getMyClubs);
router.get('/:id', protect, getClubById);

// Join Route
router.post('/:id/join', protect, joinClub);

// Admin Routes
router.post('/', protect, isAdmin, createClub);
router.put('/:id', protect, updateClub);
router.put('/:id/change-president', protect, isAdmin, changePresident);
router.delete('/:id', protect, deleteClub);

module.exports = router;