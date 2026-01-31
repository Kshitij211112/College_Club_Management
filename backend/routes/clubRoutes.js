const express = require('express');
const router = express.Router();

const {getAllClubs,getClubById,createClub,updateClub,deleteClub,addFullTeam} = require('../controllers/clubController');
 
const protect = require("../middleware/auth.middleware");
const restrictTo = require("../middleware/role.middleware");



router.get('/getallclubs', protect, getAllClubs);
router.get('/:id', protect, getClubById);

router.post('/createclub', protect, restrictTo("admin", "club_leader"), createClub);
router.put('/:id', protect, restrictTo("admin", "club_leader"), updateClub);
router.delete('/:id', protect, restrictTo("admin", "club_leader"), deleteClub);
router.post(
  '/:clubId/teams/create',
  protect,
  restrictTo("admin", "club_leader"),
  addFullTeam
);

module.exports = router;