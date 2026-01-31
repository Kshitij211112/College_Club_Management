const Club = require('../models/Club');

exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("president", "name email")
      .select("name description category logo image president members")
      .sort({ createdAt: -1 });

    const formatted = clubs.map(club => ({
      id: club._id,
      name: club.name,
      description: club.description,
      category: club.category,
      logo: club.logo,
      image: club.image,
      president: club.president?.name || "Unknown",
      membersCount: club.members?.length || 0
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({
      message: "Failed to fetch clubs",
      error: error.message
    });
  }
};

exports.getClubById = async (req, res) => {
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

exports.createClub = async (req, res) => {
  try {
    const { name, description, category, logo, image } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required"
      });
    }

    const exists = await Club.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Club already exists" });
    }

    const presidentId = req.user.id;

    const club = await Club.create({
      name,
      description,
      category: category || "Other",
      logo: logo || "https://via.placeholder.com/400x300?text=Club+Logo",
      image: image || "https://via.placeholder.com/400x300?text=Club+Image",
      president: presidentId,
      members: [presidentId],
      teams: []
    });

    res.status(201).json({
      message: "Club created successfully",
      club
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create club",
      error: error.message
    });
  }
};

exports.updateClub = async (req, res) => {
  try {
    const clubId = req.params.id;
    const { name, description, category, logo, image } = req.body;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (club.president.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the club president can update this club"
      });
    }

    club.name = name || club.name;
    club.description = description || club.description;
    club.category = category || club.category;
    club.logo = logo || club.logo;
    club.image = image || club.image;

    const updatedClub = await club.save();

    res.status(200).json({
      message: "Club updated successfully",
      updatedClub
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update club",
      error: error.message
    });
  }
};

exports.deleteClub = async (req, res) => {
  try {
    const clubId = req.params.id;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (club.president.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only the president or admin can delete this club"
      });
    }

    await club.deleteOne();

    res.status(200).json({
      message: "Club deleted successfully",
      clubId
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete club",
      error: error.message
    });
  }
};

exports.addFullTeam = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { name, leader, members } = req.body;

    // Validations
    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    if (!leader) {
      return res.status(400).json({ message: "Team leader is required" });
    }

    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check president authorization
    if (club.president.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the club president can create teams"
      });
    }

    // Push new team
    const newTeam = {
      name,
      leader,
      members: members || []
    };

    club.teams.push(newTeam);

    await club.save();

    res.status(201).json({
      message: "Team created successfully",
      team: newTeam,
      allTeams: club.teams
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create team",
      error: error.message
    });
  }
};

