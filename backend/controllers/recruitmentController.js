const Recruitment = require('../models/Recruitment');

// @desc    Get positions for a club
// @route   GET /api/recruitment?clubId=X
// @access  Public
exports.getPositions = async (req, res) => {
  try {
    const { clubId } = req.query;
    const filter = clubId ? { clubId } : {};
    const positions = await Recruitment.find(filter)
      .populate('clubId', 'name logo')
      .populate('applications.userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: positions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new position
// @route   POST /api/recruitment
// @access  Private (President)
exports.createPosition = async (req, res) => {
  try {
    const { clubId, title, description, team, deadline } = req.body;
    const position = await Recruitment.create({
      clubId, title, description, team, deadline
    });
    res.status(201).json({ success: true, data: position });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update a position
// @route   PUT /api/recruitment/:id
// @access  Private (President)
exports.updatePosition = async (req, res) => {
  try {
    const position = await Recruitment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!position) return res.status(404).json({ success: false, message: 'Position not found' });
    res.status(200).json({ success: true, data: position });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete a position
// @route   DELETE /api/recruitment/:id
// @access  Private (President)
exports.deletePosition = async (req, res) => {
  try {
    const position = await Recruitment.findByIdAndDelete(req.params.id);
    if (!position) return res.status(404).json({ success: false, message: 'Position not found' });
    res.status(200).json({ success: true, message: 'Position deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Apply to a position
// @route   POST /api/recruitment/:id/apply
// @access  Private (Student)
exports.applyToPosition = async (req, res) => {
  try {
    const position = await Recruitment.findById(req.params.id);
    if (!position) return res.status(404).json({ success: false, message: 'Position not found' });
    if (position.status === 'closed') return res.status(400).json({ success: false, message: 'Position is closed' });
    if (new Date(position.deadline) < new Date()) return res.status(400).json({ success: false, message: 'Deadline has passed' });

    const alreadyApplied = position.applications.some(
      a => a.userId.toString() === req.user.id
    );
    if (alreadyApplied) return res.status(400).json({ success: false, message: 'Already applied' });

    const { name, email, message } = req.body;
    position.applications.push({
      userId: req.user.id,
      name: name || 'Unknown',
      email: email || '',
      message: message || ''
    });
    await position.save();

    res.status(200).json({ success: true, message: 'Application submitted', data: position });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Accept or reject an application
// @route   PUT /api/recruitment/:id/applications/:appId
// @access  Private (President)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be accepted or rejected' });
    }

    const position = await Recruitment.findById(req.params.id);
    if (!position) return res.status(404).json({ success: false, message: 'Position not found' });

    const app = position.applications.id(req.params.appId);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

    app.status = status;
    await position.save();

    res.status(200).json({ success: true, message: `Application ${status}`, data: position });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
