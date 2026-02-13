const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true,min_length:6 },
  role: {
    type: String,
    enum: ["student", "admin", "president"],
    default: "student",
  },
  
  managedClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    default: null,
  },
  followedClubs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
