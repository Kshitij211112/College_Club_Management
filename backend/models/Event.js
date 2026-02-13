const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },

  date: {
    type: Date,
    required: [true, 'Event date is required']
  },

  time: {
    type: String,
    required: [true, 'Event time is required']
  },

  duration: {
    type: String,  // e.g. "2 hours", "3 hours"
    default: null
  },

  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },

  eventType: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid'],
    default: 'Offline'
  },

  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: [true, 'Club ID is required']
  },

  poster: {
    type: String,
    default: 'https://via.placeholder.com/600x400?text=Event+Poster'
  },

  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Workshop', 'Competition', 'Performance', 'Other'],
    default: 'Other'
  },

  fees: {
    type: Number,
    default: 0
  },

  prizes: [{
    position: { type: String },
    reward: { type: String }
  }],

  rules: [{
    type: String
  }],

  sponsors: [{
    name: String,
    logo: String
  }],

  organizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  registrationDeadline: {
    type: Date,
    default: null
  },

  registrations: {
    type: Number,
    default: 0,
    min: 0
  },

  maxCapacity: {
    type: Number,
    default: null
  },

  isActive: {
    type: Boolean,
    default: true
  },

  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },

  contact: {
    phone: { type: String, default: null },
    email: { type: String, default: null }
  }

}, { timestamps: true });

// Index for faster queries
eventSchema.index({ date: 1, clubId: 1 });

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);
