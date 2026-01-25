// backend/models/Club.js

const mongoose = require('mongoose');

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
    members: {
      type: Number,
      required: [true, 'Please add number of members'],
      min: [0, 'Members cannot be negative']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Club', clubSchema);