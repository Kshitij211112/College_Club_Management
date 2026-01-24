const Club = require('../models/Club');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
exports.getAllClubs = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // Build filter object
    let filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const clubs = await Club.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clubs',
      error: error.message
    });
  }
};

// @desc    Get single club by ID
// @route   GET /api/clubs/:id
// @access  Public
exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching club',
      error: error.message
    });
  }
};

// @desc    Create new club
// @route   POST /api/clubs
// @access  Private/Admin
exports.createClub = async (req, res) => {
  try {
    const club = await Club.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: club
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Club with this name already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating club',
      error: error.message
    });
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Private/Admin
exports.updateClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Club updated successfully',
      data: club
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating club',
      error: error.message
    });
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Private/Admin
exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Club deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting club',
      error: error.message
    });
  }
};