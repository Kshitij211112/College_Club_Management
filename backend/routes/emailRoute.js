const express = require("express");
const router = express.Router();
const { sendCertificates, sendBatchCertificates } = require("../controllers/emailController");

// Single email (test or individual manual send)
router.post("/send", sendCertificates);

// Batch email (primary use case)
router.post("/send-batch", sendBatchCertificates);

module.exports = router;
