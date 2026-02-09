const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leader: { type: String }, // Changed to String for direct name input
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Technical', 'Cultural', 'Sports', 'Arts', 'Music', 'Drama', 'Other'], default: 'Other' },
  
  // Now stores the Name directly as a String
  president: { 
    type: String, 
    required: true 
  },
  vicePresident: { 
    type: String, 
    required: false,
    default: "Not Assigned" 
  },
  
  logo: { type: String, default: "https://via.placeholder.com/150" },
  image: { type: String, default: "https://via.placeholder.com/400" },
  teams: [teamSchema],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Club', clubSchema);