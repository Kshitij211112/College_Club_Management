const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  logo: {
    type: String,
    default: 'https://via.placeholder.com/400'
  },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Arts', 'Sports', 'Other'],
    default: 'Other'
  },
  members: {
    type: Number,
    default: 0,
    min: 0
  },
  achievements: [{
    type: String,
    trim: true
  }],
  president: {
    type: String,
    trim: true
  },
  vicePresident: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  socialMedia: {
    instagram: String,
    linkedin: String,
    twitter: String
  },
  founded: {
    type: String,
    default: new Date().getFullYear().toString()
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Club || mongoose.model('Club', clubSchema);