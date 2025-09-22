const express = require("express");
const router = express.Router();
const Inquiry = require("../models/inquiry");

// Show inquiry form
router.get("/new", (req, res) => {
  const service = req.query.service || "";
  res.render("inquiryForm", { service, error: null });
});

// Handle form submission
router.post("/new", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // Basic validation (to avoid empty submissions)
    if (!name || !email || !phone || !service) {
      return res.render("inquiryForm", { 
        service, 
        error: "❌ Please fill in all required fields." 
      });
    }

    const newInquiry = new Inquiry({ name, email, phone, service, message });
    await newInquiry.save();

    // Redirect to success page
    res.redirect("/inquiry/success");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "❌ Something went wrong. Please try again later." });
  }
});

// Success page
router.get("/success", (req, res) => {
  res.render("success", { message: "✅ Inquiry submitted successfully!" });
});

// Show upload page
router.get("/upload/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).render("error", { message: "Inquiry not found." });
    }
    res.render("upload", { inquiry, message: null });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { message: "❌ Server error. Please try again later." });
  }
});

module.exports = router;
