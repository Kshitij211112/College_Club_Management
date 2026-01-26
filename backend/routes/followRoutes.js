const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { handleFollowClub, handleUnfollowClub } = require("../controllers/followController");  // ✅ Updated names

router.post("/follow/:clubId", protect, handleFollowClub);
router.post("/unfollow/:clubId", protect, handleUnfollowClub);

module.exports = router;