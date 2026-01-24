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
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: [true, 'Club ID is required']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400'
  },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Workshop', 'Competition', 'Performance', 'Other'],
    default: 'Other'
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
  registrationOpen: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ date: 1, clubId: 1 });

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);