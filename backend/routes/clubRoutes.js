const express = require('express');
const router = express.Router();
const { 
    getAllClubs, 
    getMyClubs, 
    joinClub, 
    getClubById,
    createClub, 
    updateClub, 
    deleteClub 
} = require('../controllers/clubController');
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Ensure these functions are NOT undefined
router.get('/', getAllClubs); // Line 17 (likely where the error was)
router.get('/my-clubs', protect, getMyClubs);
router.get('/:id', protect, getClubById);

// Join Route
router.post('/:id/join', protect, joinClub); 

// Admin Routes
router.post('/', protect, isAdmin, createClub); 
router.put('/:id', protect, isAdmin, updateClub);
router.delete('/:id', protect, isAdmin, deleteClub);

module.exports = router;