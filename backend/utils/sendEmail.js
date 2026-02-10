const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(to, filePath) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL,
    to,
    subject: "Your Certificate",
    text: "Congratulations! Please find your certificate attached.",
    attachments: [
      {
        filename: "certificate.png",
        path: filePath
      },
    ],
  });
}

module.exports = sendEmail;
