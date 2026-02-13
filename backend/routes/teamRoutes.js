const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :clubId from parent
const {
  getTeamsByClub,
  createTeam,
  addTeamMember,
  removeTeamMember,
  updateTeam,
  deleteTeam
} = require('../controllers/clubController');

const { protect } = require('../middleware/authMiddleware');

// Public - view teams
router.get('/', getTeamsByClub);

// Private - president manages teams (auth checked inside controller)
router.post('/', protect, createTeam);
router.put('/:teamId', protect, updateTeam);
router.delete('/:teamId', protect, deleteTeam);

// Private - president manages team members (auth checked inside controller)
router.post('/:teamId/members', protect, addTeamMember);
router.delete('/:teamId/members/:memberId', protect, removeTeamMember);

module.exports = router;