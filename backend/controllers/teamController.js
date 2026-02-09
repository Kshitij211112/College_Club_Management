const Team = require('../models/Team');
const User = require('../models/User');

// @desc    Get all teams for a specific club
// @route   GET /api/clubs/:clubId/teams
// @access  Public
exports.getTeamsByClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    const teams = await Team.find({ club: clubId })
      .populate('members.user', 'name email avatar')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
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

// @desc    Create a new team
// @route   POST /api/clubs/:clubId/teams
// @access  Private (President only)
exports.createTeam = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { name, description } = req.body;

    // Check if team already exists for this club
    const existingTeam = await Team.findOne({ name, club: clubId });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'This team already exists for your club'
      });
    }

    const team = await Team.create({
      name,
      club: clubId,
      description,
      members: []
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
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

// @desc    Add member to team
// @route   POST /api/clubs/:clubId/teams/:teamId/members
// @access  Private (President only)
exports.addTeamMember = async (req, res) => {
  try {
    const { clubId, teamId } = req.params;
    const { userId, role = 'member' } = req.body;

    // Validate that user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find team and verify it belongs to the club
    const team = await Team.findOne({ _id: teamId, club: clubId });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if member already exists in team
    const memberExists = team.members.some(
      member => member.user.toString() === userId.toString()
    );

    if (memberExists) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this team'
      });
    }

    // Add member to team
    team.members.push({
      user: userId,
      role: role
    });

    await team.save();

    // Populate the newly added member details
    await team.populate('members.user', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: team
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

// @desc    Remove member from team
// @route   DELETE /api/clubs/:clubId/teams/:teamId/members/:memberId
// @access  Private (President only)
exports.removeTeamMember = async (req, res) => {
  try {
    const { clubId, teamId, memberId } = req.params;

    const team = await Team.findOne({ _id: teamId, club: clubId });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Remove member from team
    const initialLength = team.members.length;
    team.members = team.members.filter(
      member => member.user.toString() !== memberId.toString()
    );

    if (team.members.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this team'
      });
    }

    await team.save();

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: team
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

// @desc    Update member role in team
// @route   PUT /api/clubs/:clubId/teams/:teamId/members/:memberId
// @access  Private (President only)
exports.updateMemberRole = async (req, res) => {
  try {
    const { clubId, teamId, memberId } = req.params;
    const { role } = req.body;

    if (!['member', 'lead', 'co-lead'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be member, lead, or co-lead'
      });
    }

    const team = await Team.findOne({ _id: teamId, club: clubId });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Find and update member role
    const member = team.members.find(
      m => m.user.toString() === memberId.toString()
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this team'
      });
    }

    member.role = role;
    await team.save();
    await team.populate('members.user', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Member role updated successfully',
      data: team
    });
  } catch (error) {
    console.error('Error updating member role:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating member role',
      error: error.message
    });
  }
};

// @desc    Delete a team
// @route   DELETE /api/clubs/:clubId/teams/:teamId
// @access  Private (President only)
exports.deleteTeam = async (req, res) => {
  try {
    const { clubId, teamId } = req.params;

    const team = await Team.findOneAndDelete({ _id: teamId, club: clubId });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
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