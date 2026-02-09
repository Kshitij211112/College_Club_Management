const express = require('express');
const router = express.Router({ mergeParams: true }); 
const {
  getTeamsByClub,
  createTeam,
  addTeamMember,
  removeTeamMember,
  updateMemberRole,
  deleteTeam
} = require('../controllers/teamController');


const { protect } = require('../middleware/authMiddleware'); 
const { isPresident } = require('../middleware/clubAuth');

// Public routes
router.get('/', getTeamsByClub);

// Protected routes - President only
router.post('/', protect, isPresident, createTeam);
router.post('/:teamId/members', protect, isPresident, addTeamMember);
router.put('/:teamId/members/:memberId', protect, isPresident, updateMemberRole);
router.delete('/:teamId/members/:memberId', protect, isPresident, removeTeamMember);
router.delete('/:teamId', protect, isPresident, deleteTeam);

module.exports = router;