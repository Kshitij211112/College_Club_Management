const mongoose = require("mongoose");

const templateSettingsSchema = new mongoose.Schema({
  templateUrl: { type: String },
  
  // Coordinates (Legacy Px)
  nameX: { type: Number },
  nameY: { type: Number },
  
  // Coordinates (Relative %)
  xPercent: { type: Number },
  yPercent: { type: Number },
  
  // Coordinates (Raw Top-Left for Restoration)
  x: { type: Number },
  y: { type: Number },

  // Typography
  fontSize: { type: Number },
  fontFamily: { type: String, default: "Arial" },
  fontWeight: { type: Number },
  fontStyle: { type: String },
  textDecoration: { type: String },
  
  // Colors & Alignment
  fontColor: { type: String }, // Legacy
  color: { type: String },     // New Standard
  alignment: { type: String }, // Legacy
  textAlign: { type: String }, // New Standard
  
  // Spacing
  letterSpacing: { type: Number },
  lineHeight: { type: Number },

  // Dimensions
  previewWidth: { type: Number },
  previewHeight: { type: Number },
  originalWidth: { type: Number },
  originalHeight: { type: Number }
});

module.exports = mongoose.model("TemplateSettings", templateSettingsSchema);
