const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Configure transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com", // Default to gmail if not set
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendCertificates = async (req, res) => {
  const { recipientEmail, recipientName, subject, body, certificateUrl } = req.body;

  if (!recipientEmail || !certificateUrl) {
    return res.status(400).json({ message: "Recipient email and certificate URL are required." });
  }

  // Construct absolute path to the certificate file
  // Assuming certificateUrl is relative like "/generated/certificate_123.pdf"
  const relativePath = certificateUrl.startsWith("/") ? certificateUrl.slice(1) : certificateUrl;
  const filePath = path.join(__dirname, "..", "generated", path.basename(certificateUrl)); // Adjust based on your actual storage logic

  // Check if file exists
  // Note: If using a cloud storage URL, we'd need to fetch it or pass it as a stream/buffer.
  // For local filesystem:
  // if (!fs.existsSync(filePath)) {
  //   return res.status(404).json({ message: "Certificate file not found." });
  // }

  // Simple customization of body
  // We can replace {{name}} with recipientName if present
  let customizedBody = body;
  if (recipientName) {
    customizedBody = customizedBody.replace(/{{name}}/g, recipientName);
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Certificate Team" <no-reply@example.com>',
    to: recipientEmail,
    subject: subject || "Your Certificate",
    html: customizedBody,
    attachments: [
      {
        filename: path.basename(certificateUrl),
        path: filePath // Or url if it's publicly accessible
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};

exports.sendBatchCertificates = async (req, res) => {
    const { recipients, subject, body } = req.body; // recipients: [{ email, name, certificateUrl }, ...]

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ message: "Recipients list is required." });
    }

    let successCount = 0;
    let failCount = 0;
    const errors = [];

    // Process in parallel or series? Series is safer for rate limits.
    // Let's do a simple loop for now.
    
    for (const recipient of recipients) {
        try {
            const { email, name, certificateUrl } = recipient;
             // Construct absolute path
            // Assuming certificateUrl is relative, e.g., "/generated/..."
            // But verify_file shows app.js serves /generated from root.
            // Let's assume file path is relative to project root 'generated' folder
            
            // Adjust path logic:
            // if url is http://localhost:5050/generated/file.pdf -> we need file system path
            // logic: extract filename, append to 'generated' dir
            
            const filename = path.basename(certificateUrl);
            const filePath = path.resolve(__dirname, "..", "generated", filename);

            let customizedBody = body;
            if (name) {
                customizedBody = customizedBody.replace(/{{name}}/g, name);
            }

            const mailOptions = {
                from: process.env.SMTP_FROM || '"Certificate Team" <no-reply@example.com>',
                to: email,
                subject: subject || "Your Certificate",
                html: customizedBody,
                attachments: [
                    {
                        filename: filename,
                        path: filePath
                    }
                ]
            };
            
            await transporter.sendMail(mailOptions);
            successCount++;

        } catch (error) {
            console.error(`Failed to send to ${recipient.email}:`, error);
            failCount++;
            errors.push({ email: recipient.email, error: error.message });
        }
    }

    res.status(200).json({
        message: "Batch sending completed",
        total: recipients.length,
        success: successCount,
        failed: failCount,
        errors: errors
    });
};
