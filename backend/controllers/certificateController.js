const csv = require("csv-parser");
const fs = require("fs");
const Participant = require("../models/participants");
const path = require("path");
const generateCertificate = require("../utils/generateCertificate");
const sendEmail = require("../utils/sendEmail");

// Upload CSV and save participants
// Upload CSV and save participants
exports.uploadCSV = async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (let row of results) {
        if (row.email) {
          await Participant.findOneAndUpdate(
            { email: row.email },
            { name: row.name, event: row.event },
            { upsert: true, new: true }
          );
        }
      }

      res.json({ message: "CSV Uploaded & Participants Saved" });
    });
};

// Generate cert + send email
exports.generateAndSendCertificates = async (req, res) => {
  // 1. Check/Sync Participants from CSV
  const csvPath = path.join(__dirname, "../uploads/participants.csv");
  if (fs.existsSync(csvPath)) {
      // CLEAR DB if CSV exists (Source of Truth)
      await Participant.deleteMany({});
      
      const results = [];
      await new Promise((resolve) => {
          fs.createReadStream(csvPath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", async () => {
              // Insert all participants
              for (let row of results) {
                 if(row.email || row.name) { // Ensure at least name or email
                    await Participant.create({
                        name: row.name, 
                        email: row.email, 
                        event: row.event || "Event", 
                        status: "pending" 
                    });
                 }
              }
              resolve();
            });
      });
  }

  // 2. Generate
  const participants = await Participant.find({}); 
  const generatedFiles = [];

  // OPTIMIZATION: Load settings and template ONCE
  const TemplateSettings = require("../models/templateSettings");
  const { loadImage } = require("canvas");

  const settings = await TemplateSettings.findOne({});
  if (!settings || !settings.templateUrl) {
      return res.status(400).json({ message: "Template settings missing" });
  }

  const templateUrl = settings.templateUrl.replace("http://localhost:5050/", "");
  const localPath = path.join(__dirname, "..", templateUrl);
  
  let templateImage;
  try {
      templateImage = await loadImage(localPath);
  } catch (err) {
      console.error("Failed to load template image:", err);
      return res.status(500).json({ message: "Failed to load template image" });
  }

  console.log(`Starting generation for ${participants.length} participants...`);

  for (let p of participants) {
    try {
      // Pass the pre-loaded settings and image
      const filePath = await generateCertificate(p, settings, templateImage);
      const publicUrl = `http://localhost:5050/${filePath.replace("./", "")}`;
      
      generatedFiles.push({
        url: publicUrl,
        name: p.name,
        email: p.email,
        id: p._id
      });
      
      p.certificatePath = filePath;
      p.status = "generated"; // Changed from "sent" to distinguish generation vs email
      await p.save();
    } catch (err) {
      console.log("Error processing:", p.email, err);
      p.status = "failed";
      await p.save();
    }
  }

  console.log("Generation completed.");
  res.json({ message: "Certificates Generated Successfully", files: generatedFiles });
};

// Send Emails
exports.sendCertificates = async (req, res) => {
  try {
      const participants = await Participant.find({ status: "generated" });
      let count = 0;

      for (let p of participants) {
          if (p.email && p.certificatePath) {
              // Read file buffer for attachment if needed, or just path
              // sendEmail expects: (email, name, attachmentPath)
              await sendEmail(p.email, p.name, p.certificatePath);
              p.status = "emailed";
              await p.save();
              count++;
          }
      }
      res.json({ message: `Emails sent successfully to ${count} participants.` });
  } catch (error) {
      console.error("Email sending failed:", error);
      res.status(500).json({ message: "Failed to send emails." });
  }
};

// Get all participants
exports.getAllParticipants = async (req, res) => {
  const users = await Participant.find();
  res.json(users);
};
