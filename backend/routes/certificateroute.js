const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadCSV,
  generateAndSendCertificates,
  getAllParticipants,
  sendCertificates
} = require("../controllers/certificateController");

// multer for CSV upload
const upload = multer({ dest: "uploads/" });

router.post("/upload-csv", upload.single("File"), uploadCSV);
router.post("/process", generateAndSendCertificates);
router.post("/send-emails", sendCertificates);
router.get("/participants", getAllParticipants);

module.exports = router;
