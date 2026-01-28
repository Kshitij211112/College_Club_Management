// backend/routes/clubRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub
} = require('../controllers/clubController');
const protect = require("../middleware/auth.middleware");
const restrictTo = require("../middleware/role.middleware");




// @route   GET /api/clubs
// @desc    Get all clubs
router.get('/getallclubs',protect, getAllClubs);

// @route   GET /api/clubs/:id
// @desc    Get single club
router.get('/:id',protect, getClubById);

// @route   POST /api/clubs
// @desc    Create new club
router.post('/createclub',restrictTo("admin", "club_leader"),protect, createClub);

// @route   PUT /api/clubs/:id
// @desc    Update club
router.put('/:id',restrictTo("admin", "club_leader"),protect, updateClub);

// @route   DELETE /api/clubs/:id
// @desc    Delete club
router.delete('/:id',restrictTo("admin", "club_leader"),protect, deleteClub);

module.exports = router;