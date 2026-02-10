const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: String,
  email: String,
  event: String,
  certificatePath: String,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Participant", participantSchema);
