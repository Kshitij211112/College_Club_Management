const mongoose = require('mongoose');

// TEAM SCHEMA (for club teams)
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Technical Team"

  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

// MAIN CLUB SCHEMA
const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a club name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },

    logo: {
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Club+Logo'
    },

    image: {
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Club+Image'
    },

    category: {
      type: String,
      enum: ['Technical', 'Cultural', 'Sports', 'Arts', 'Music', 'Drama', 'Other'],
      default: 'Other'
    },

    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },

    // ⭐ Club President (can manage all teams)
    president: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ⭐ Admin who created/approved this club
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // ⭐ All Teams in the Club
    teams: [teamSchema],

    // ⭐ All Members of the Club
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Club', clubSchema);
