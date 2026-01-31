const User = require("../models/User");
const Club = require("../models/Club");

exports.handleFollowClub = async (req, res) => {  
  try {
    const userId = req.user.id;
    const clubId = req.params.clubId;

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Add club to user's followed list if not already followed
    const user = await User.findById(userId);
    if (user.followedClubs.includes(clubId)) {
      return res.status(400).json({ message: "Already following this club" });
    }

    user.followedClubs.push(clubId);
    await user.save();

    res.json({ 
      message: "Club followed successfully", 
      followedClubs: user.followedClubs 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleUnfollowClub = async (req, res) => {  // ✅ Changed "handel" to "handle"
  try {
    const userId = req.user.id;
    const clubId = req.params.clubId;

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const user = await User.findById(userId);
    
    if (!user.followedClubs.includes(clubId)) {
      return res.status(400).json({ message: "You are not following this club" });
    }

    user.followedClubs = user.followedClubs.filter(
      id => id.toString() !== clubId
    );
    await user.save();

    res.json({ 
      message: "Club unfollowed successfully", 
      followedClubs: user.followedClubs 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};