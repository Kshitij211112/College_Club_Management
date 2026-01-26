const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { handelFollowClub,handelUnfollowClub } =require( "../controllers/followController");

router.post("/follow/:clubId",protect,handelFollowClub);
router.post("/unfollow/:clubId",protect,handelUnfollowClub );


module.exports = router;