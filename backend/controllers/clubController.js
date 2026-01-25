// backend/controllers/clubController.js

const Club = require('../models/Club');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    res.status(200).json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({ 
      message: 'Failed to fetch clubs', 
      error: error.message 
    });
  }
};

// @desc    Get single club by ID
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    
    res.status(200).json(club);
  } catch (error) {
    console.error('Error fetching club:', error);
    res.status(500).json({ 
      message: 'Failed to fetch club', 
      error: error.message 
    });
  }
};

// @desc    Create new club
// @route   POST /api/clubs
// @access  Private (you can add auth middleware later)
const createClub = async (req, res) => {
  try {
    const { name, members, description, logo, image, category } = req.body;

    // Validation
    if (!name || !members || !description) {
      return res.status(400).json({ 
        message: 'Please provide name, members, and description' 
      });
    }

    // Check if club already exists
    const clubExists = await Club.findOne({ name });
    if (clubExists) {
      return res.status(400).json({ 
        message: 'Club with this name already exists' 
      });
    }

    // Create club
    const club = await Club.create({
      name,
      members,
      description,
      logo: logo || 'https://via.placeholder.com/400x300?text=Club+Logo',
      image: image || 'https://via.placeholder.com/400x300?text=Club+Image',
      category: category || 'Other'
    });

    res.status(201).json(club);
  } catch (error) {
    console.error('Error creating club:', error);
    res.status(500).json({ 
      message: 'Failed to create club', 
      error: error.message 
    });
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Private
const updateClub = async (req, res) => {
  try {
    const { name, members, description, logo, image, category } = req.body;

    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Update fields
    club.name = name || club.name;
    club.members = members || club.members;
    club.description = description || club.description;
    club.logo = logo || club.logo;
    club.image = image || club.image;
    club.category = category || club.category;

    const updatedClub = await club.save();
    res.status(200).json(updatedClub);
  } catch (error) {
    console.error('Error updating club:', error);
    res.status(500).json({ 
      message: 'Failed to update club', 
      error: error.message 
    });
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Private
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    await club.deleteOne();
    res.status(200).json({ 
      message: 'Club deleted successfully',
      id: req.params.id 
    });
  } catch (error) {
    console.error('Error deleting club:', error);
    res.status(500).json({ 
      message: 'Failed to delete club', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub
};