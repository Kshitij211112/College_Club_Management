const TemplateSettings = require("../models/templateSettings");
exports.uploadTemplate = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `http://localhost:5050/templates/${req.file.filename}`;

  await TemplateSettings.findOneAndUpdate(
    {},
    { templateUrl: fileUrl },
    { new: true, upsert: true }
  );

  res.json({ url: fileUrl });
};



exports.saveCoordinates = async (req, res) => {
  try {
    // For simplicity, we'll update the first document or create one if it doesn't exist
    // In a real app, you might have multiple templates
    const settings = await TemplateSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json({ message: "Coordinates saved", settings });
  } catch (error) {
    res.status(500).json({ message: "Error saving coordinates", error });
  }
};
