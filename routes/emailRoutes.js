const express = require("express");
const router = express.Router();
const sendMail = require("../mailer");

// ✅ Route to send email (form submission style)
router.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).render("error", { message: "❌ All fields are required." });
  }

  try {
    await sendMail(to, subject, message);
    res.render("success", { message: "✅ Email sent successfully!" });
  } catch (err) {
    console.error("❌ Email send error:", err);
    res.status(500).render("error", { message: "❌ Email sending failed. Please try again later." });
  }
});

module.exports = router;
