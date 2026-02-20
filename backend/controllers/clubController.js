const Club = require('../models/Club');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// ─────────────────────────────────────────────
// CLUB CRUD OPERATIONS
// ─────────────────────────────────────────────

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("president", "name email")
      .populate("createdBy", "name email")
      .select("name description category logo image president createdBy members teams")
      .sort({ createdAt: -1 });

    const formatted = clubs.map(club => ({
      _id: club._id,
      name: club.name,
      description: club.description,
      category: club.category,
      logo: club.logo,
      image: club.image,
      president: club.president?._id || club.president,
      presidentName: club.president?.name || "Unknown",
      presidentEmail: club.president?.email || "",
      createdBy: club.createdBy?.name || "Admin",
      membersCount: club.members?.length || 0,
      members: club.members ? club.members.map(m => m.toString()) : [],
      teamsCount: club.teams?.length || 0
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

// @desc    Get clubs the current user is a member of
// @route   GET /api/clubs/my-clubs
// @access  Private
exports.getMyClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ members: req.user.id })
      .populate("president", "name email")
      .sort({ createdAt: -1 });

    const formatted = clubs.map(club => ({
      _id: club._id,
      name: club.name,
      description: club.description,
      category: club.category,
      logo: club.logo,
      image: club.image,
      president: club.president?._id || club.president,
      presidentName: club.president?.name || "Unknown",
      membersCount: club.members?.length || 0,
      members: club.members ? club.members.map(m => m.toString()) : [],
      teamsCount: club.teams?.length || 0
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load your clubs",
      error: error.message
    });
  }
};

// @desc    Get club by ID
// @route   GET /api/clubs/:id
// @access  Private
exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("president", "name email")
      .populate("members", "name email")
      .populate("teams.leader", "name email")
      .populate("teams.members", "name email");

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    const clubObj = club.toObject();

    res.status(200).json({
      ...clubObj,
      presidentName: club.president?.name || "Unknown",
      membersCount: club.members?.length || 0,
      members: club.members || []
    });
  } catch (error) {
    console.error('Error fetching club:', error);
    res.status(500).json({
      message: 'Failed to fetch club',
      error: error.message
    });
  }
};

// @desc    Create a new club (Admin creates club + president account)
// @route   POST /api/clubs
// @access  Private (Admin only)
exports.createClub = async (req, res) => {
  try {
    const { name, description, category, logo, image, presidentName, presidentEmail } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required"
      });
    }
    if (!presidentName || !presidentEmail) {
      return res.status(400).json({
        message: "President name and email are required"
      });
    }

    // Check if club name already exists
    const exists = await Club.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: "A club with this name already exists" });
    }

    // Generate a random 8-character password for the president
    const generatedPassword = crypto.randomBytes(4).toString('hex');

    // Prevent admin from assigning themselves as president
    const adminUser = await User.findById(req.user.id);
    if (adminUser && adminUser.email === presidentEmail.trim().toLowerCase()) {
      return res.status(400).json({
        message: "You cannot assign yourself as the president. Please use a different email."
      });
    }

    // Check if a user with this email already exists
    let presidentUser = await User.findOne({ email: presidentEmail.trim().toLowerCase() });
    let isExistingUser = false;

    if (presidentUser) {
      // Never overwrite an admin user
      if (presidentUser.role === 'admin') {
        return res.status(400).json({
          message: "This email belongs to an admin account. Please use a different email for the president."
        });
      }
      // If user exists but is already a president of another club, reject
      if (presidentUser.role === 'president' && presidentUser.managedClub) {
        return res.status(400).json({
          message: "This user is already a president of another club"
        });
      }
      // Update existing user to president role
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);
      presidentUser.name = presidentName.trim();
      presidentUser.password = hashedPassword;
      presidentUser.role = 'president';
      await presidentUser.save();
      isExistingUser = true;
    } else {
      // Create new president user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);
      presidentUser = await User.create({
        name: presidentName.trim(),
        email: presidentEmail.trim().toLowerCase(),
        password: hashedPassword,
        role: 'president'
      });
    }

    // Create the club
    const club = await Club.create({
      name: name.trim(),
      description,
      category: category || "Other",
      logo: logo || undefined,
      image: image || undefined,
      president: presidentUser._id,
      createdBy: req.user.id,
      members: [presidentUser._id],
      teams: []
    });

    // Link the club to the president user
    presidentUser.managedClub = club._id;
    await presidentUser.save();

    // Populate president for response
    await club.populate("president", "name email");

    res.status(201).json({
      message: "Club created successfully!",
      generatedPassword,
      presidentEmail: presidentEmail.trim().toLowerCase(),
      club: {
        ...club.toObject(),
        presidentName: club.president?.name || "Unknown",
        membersCount: club.members.length,
        members: club.members.map(m => m.toString())
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: "Validation Failed", errors: messages });
    }
    console.error('Error creating club:', error);
    res.status(500).json({
      message: "Failed to create club",
      error: error.message
    });
  }
};

// @desc    Join a club
// @route   POST /api/clubs/:id/join
// @access  Private
exports.joinClub = async (req, res) => {
  try {
    const userId = req.user.id;
    const club = await Club.findById(req.params.id);

    if (!club) return res.status(404).json({ message: "Club not found" });

    // Check if already a member
    const isAlreadyMember = club.members.some(m => m.toString() === userId);

    if (isAlreadyMember) {
      return res.status(200).json({ message: "You're already a member! ✨" });
    }

    // Use $addToSet to prevent race-condition duplicates
    const updatedClub = await Club.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate("president", "name email");

    res.status(200).json({
      message: "Joined successfully! 🎉",
      club: {
        ...updatedClub.toObject(),
        presidentName: updatedClub.president?.name || "Unknown",
        membersCount: updatedClub.members.length,
        members: updatedClub.members.map(m => m.toString())
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Join failed", error: error.message });
  }
};

// @desc    Update a club
// @route   PUT /api/clubs/:id
// @access  Private (President or Admin)
exports.updateClub = async (req, res) => {
  try {
    const clubId = req.params.id;
    const {
      name, description, category, logo, image,
      president, addMembers = [], removeMembers = []
    } = req.body;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Only president or admin can update
    if (club.president.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only the president or admin can update this club"
      });
    }

    // Apply field updates
    if (name) club.name = name.trim();
    if (description) club.description = description;
    if (category) club.category = category;
    if (logo) club.logo = logo;
    if (image) club.image = image;
    if (president) club.president = president;

    // Add members
    addMembers.forEach(id => {
      if (!club.members.some(m => m.toString() === id)) {
        club.members.push(id);
      }
    });

    // Remove members
    if (removeMembers.length > 0) {
      club.members = club.members.filter(
        m => !removeMembers.includes(m.toString())
      );
    }

    const updatedClub = await club.save();
    await updatedClub.populate("president", "name email");

    res.status(200).json({
      message: "Club updated successfully",
      club: {
        ...updatedClub.toObject(),
        presidentName: updatedClub.president?.name || "Unknown",
        membersCount: updatedClub.members.length
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update club",
      error: error.message
    });
  }
};

// @desc    Change the president of a club (Admin only)
// @route   PUT /api/clubs/:id/change-president
// @access  Private (Admin only)
exports.changePresident = async (req, res) => {
  try {
    const { presidentName, presidentEmail } = req.body;
    const clubId = req.params.id;

    if (!presidentName || !presidentEmail) {
      return res.status(400).json({ message: "President name and email are required" });
    }

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    // Prevent admin from assigning themselves
    const adminUser = await User.findById(req.user.id);
    if (adminUser && adminUser.email === presidentEmail.trim().toLowerCase()) {
      return res.status(400).json({ message: "You cannot assign yourself as the president." });
    }

    // Check if new email belongs to an admin
    let newPresident = await User.findOne({ email: presidentEmail.trim().toLowerCase() });
    if (newPresident && newPresident.role === 'admin') {
      return res.status(400).json({ message: "Cannot assign an admin as president." });
    }

    // Generate password for new president
    const generatedPassword = crypto.randomBytes(4).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    if (newPresident) {
      if (newPresident.role === 'president' && newPresident.managedClub && newPresident.managedClub.toString() !== clubId) {
        return res.status(400).json({ message: "This user is already president of another club." });
      }
      newPresident.name = presidentName.trim();
      newPresident.password = hashedPassword;
      newPresident.role = 'president';
      newPresident.managedClub = club._id;
      await newPresident.save();
    } else {
      newPresident = await User.create({
        name: presidentName.trim(),
        email: presidentEmail.trim().toLowerCase(),
        password: hashedPassword,
        role: 'president',
        managedClub: club._id
      });
    }

    // Revert old president to student role
    const oldPresident = await User.findById(club.president);
    if (oldPresident && oldPresident._id.toString() !== newPresident._id.toString()) {
      oldPresident.role = 'student';
      oldPresident.managedClub = null;
      await oldPresident.save();
    }

    // Update club
    club.president = newPresident._id;
    if (!club.members.some(m => m.toString() === newPresident._id.toString())) {
      club.members.push(newPresident._id);
    }
    await club.save();
    await club.populate("president", "name email");

    res.status(200).json({
      message: "President changed successfully!",
      generatedPassword,
      presidentEmail: presidentEmail.trim().toLowerCase(),
      club: {
        ...club.toObject(),
        presidentName: club.president?.name || "Unknown",
        membersCount: club.members.length
      }
    });
  } catch (error) {
    console.error('Error changing president:', error);
    res.status(500).json({ message: "Failed to change president", error: error.message });
  }
};

// @desc    Delete a club
// @route   DELETE /api/clubs/:id
// @access  Private (President or Admin)
exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
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
      clubId: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete club",
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────
// TEAM OPERATIONS (Subdocuments within Club)
// ─────────────────────────────────────────────

// @desc    Get all teams for a club
// @route   GET /api/clubs/:clubId/teams
// @access  Public
exports.getTeamsByClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    const club = await Club.findById(clubId)
      .populate("teams.leader", "name email avatar")
      .populate("teams.members", "name email avatar");

    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    res.status(200).json({
      success: true,
      count: club.teams.length,
      data: club.teams
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teams',
      error: error.message
    });
  }
};

// @desc    Create a new team in a club
// @route   POST /api/clubs/:clubId/teams
// @access  Private (President only)
exports.createTeam = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { name, description, leader } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Team name is required" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    // Check president auth
    if (club.president.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only the club president can create teams"
      });
    }

    // Check for duplicate team name
    const duplicateTeam = club.teams.find(
      t => t.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicateTeam) {
      return res.status(400).json({
        success: false,
        message: "This team already exists in your club"
      });
    }

    const newTeam = {
      name,
      leader: leader || null,
      members: []
    };

    club.teams.push(newTeam);
    await club.save();

    // Re-populate for response
    await club.populate("teams.leader", "name email avatar");
    await club.populate("teams.members", "name email avatar");

    const createdTeam = club.teams[club.teams.length - 1];

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: createdTeam
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating team',
      error: error.message
    });
  }
};

// @desc    Add member to a team
// @route   POST /api/clubs/:clubId/teams/:teamId/members
// @access  Private (President only)
exports.addTeamMember = async (req, res) => {
  try {
    const { clubId, teamId } = req.params;
    const { userId } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Check president auth
    if (club.president.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only the club president can manage team members"
      });
    }

    const team = club.teams.id(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if already a member
    const alreadyInTeam = team.members.some(m => m.toString() === userId);
    if (alreadyInTeam) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this team'
      });
    }

    team.members.push(userId);
    await club.save();

    // Re-populate for response
    await club.populate("teams.leader", "name email avatar");
    await club.populate("teams.members", "name email avatar");

    const updatedTeam = club.teams.id(teamId);

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: updatedTeam
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding team member',
      error: error.message
    });
  }
};

// @desc    Remove member from a team
// @route   DELETE /api/clubs/:clubId/teams/:teamId/members/:memberId
// @access  Private (President only)
exports.removeTeamMember = async (req, res) => {
  try {
    const { clubId, teamId, memberId } = req.params;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Check president auth
    if (club.president.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only the club president can manage team members"
      });
    }

    const team = club.teams.id(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const initialLength = team.members.length;
    team.members = team.members.filter(m => m.toString() !== memberId);

    if (team.members.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this team'
      });
    }

    await club.save();

    // Re-populate for response
    await club.populate("teams.leader", "name email avatar");
    await club.populate("teams.members", "name email avatar");

    const updatedTeam = club.teams.id(teamId);

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: updatedTeam
    });
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing team member',
      error: error.message
    });
  }
};

// @desc    Update team details (name, leader)
// @route   PUT /api/clubs/:clubId/teams/:teamId
// @access  Private (President only)
exports.updateTeam = async (req, res) => {
  try {
    const { clubId, teamId } = req.params;
    const { name, leader, addMembers = [], removeMembers = [] } = req.body;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    // Check president auth
    if (club.president.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only the club president or admin can update teams"
      });
    }

    const team = club.teams.id(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    // Update fields
    if (name) team.name = name;
    if (leader) team.leader = leader;

    // Add members
    addMembers.forEach(memberId => {
      if (!team.members.some(m => m.toString() === memberId)) {
        team.members.push(memberId);
      }
    });

    // Remove members
    if (removeMembers.length > 0) {
      team.members = team.members.filter(
        m => !removeMembers.includes(m.toString())
      );
    }

    await club.save();

    // Re-populate for response
    await club.populate("teams.leader", "name email avatar");
    await club.populate("teams.members", "name email avatar");

    const updatedTeam = club.teams.id(teamId);

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: updatedTeam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update team",
      error: error.message
    });
  }
};

// @desc    Delete a team from a club
// @route   DELETE /api/clubs/:clubId/teams/:teamId
// @access  Private (President only)
exports.deleteTeam = async (req, res) => {
  try {
    const { clubId, teamId } = req.params;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    // Check president auth
    if (club.president.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only the club president can delete teams"
      });
    }

    const team = club.teams.id(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    team.deleteOne();
    await club.save();

    res.status(200).json({
      success: true,
      message: "Team deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting team',
      error: error.message
    });
  }
};