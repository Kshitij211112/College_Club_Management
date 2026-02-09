const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'lead', 'co-lead'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      'Photography',
      'Videography',
      'Technical',
      'Non-Technical',
      'Volunteers',
      'Design',
      'Content',
      'Marketing',
      'Social Media',
      'Event Management'
    ]
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  members: [teamMemberSchema],
  description: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to ensure unique team names per club
teamSchema.index({ name: 1, club: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
teamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual to get member count
teamSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

module.exports = mongoose.model('Team', teamSchema);