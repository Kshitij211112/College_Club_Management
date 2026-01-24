const express = require('express');
const router = express.Router();
const {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub
} = require('../controllers/clubController');

// Public routes
router.get('/', getAllClubs);
router.get('/:id', getClubById);

// Admin routes (add auth middleware later)
router.post('/', createClub);
router.put('/:id', updateClub);
router.delete('/:id', deleteClub);

module.exports = router;