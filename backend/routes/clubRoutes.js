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

// @route   GET /api/clubs
// @desc    Get all clubs
router.get('/', getAllClubs);

// @route   GET /api/clubs/:id
// @desc    Get single club
router.get('/:id', getClubById);

// @route   POST /api/clubs
// @desc    Create new club
router.post('/', createClub);

// @route   PUT /api/clubs/:id
// @desc    Update club
router.put('/:id', updateClub);

// @route   DELETE /api/clubs/:id
// @desc    Delete club
router.delete('/:id', deleteClub);

module.exports = router;