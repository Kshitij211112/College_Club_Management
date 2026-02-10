const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadTemplate, saveCoordinates } = require("../controllers/templateController");

// Configure storage to keep extensions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "templates/"); // FIXED
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({ storage: storage });

router.post("/upload", upload.single("template"), uploadTemplate);
router.post("/save-coordinates", saveCoordinates);

module.exports = router;
