const Club = require('../models/Club');

// Middleware to check if user is president of the specified club
const isPresident = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.id; // Assuming you have auth middleware that sets req.user

    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ 
        success: false, 
        message: 'Club not found' 
      });
    }

    // Check if the user is the president of this club
    if (club.president.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only the club president can perform this action.' 
      });
    }

    // Attach club to request for use in controller
    req.club = club;
    next();
  } catch (error) {
    console.error('Error in isPresident middleware:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Middleware to check if user is president OR vice president
const isPresidentOrVP = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.id;

    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ 
        success: false, 
        message: 'Club not found' 
      });
    }

    const isAuthorized = 
      club.president.toString() === userId.toString() || 
      club.vicePresident.toString() === userId.toString();

    if (!isAuthorized) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only president or vice president can perform this action.' 
      });
    }

    req.club = club;
    next();
  } catch (error) {
    console.error('Error in isPresidentOrVP middleware:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = { isPresident, isPresidentOrVP };