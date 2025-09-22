const express = require("express");
const router = express.Router();
const Inquiry = require("../models/inquiry");
const sendMail = require("../mailer"); // ✅ import mailer

// Middleware to protect admin routes
function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.redirect("/admin/login");
}

// ================= LOGIN =================
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    req.session.admin = true;
    return res.redirect("/admin");
  }
  res.render("login", { error: "❌ Invalid credentials, try again." });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

// ================= DASHBOARD =================
router.get("/", requireAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.render("admin", { inquiries });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Error fetching inquiries. Please try again later." });
  }
});

// ================= APPROVE INQUIRY =================
router.post("/approve/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (inquiry) {
      const uploadUrl = `${process.env.BASE_URL}/upload/${inquiry._id}`;

      // ✅ Send approval email with upload link
      await sendMail(
        inquiry.email,
        "Inquiry Approved - Fine Services",
        `
        Dear ${inquiry.name},

        Your inquiry has been approved. 
        Please upload your documents and (optionally) complete payment using the link below:

        ${uploadUrl}

        Regards,
        Fine Services
        `
      );
    }

    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Error approving inquiry. Please try again." });
  }
});

// ================= REJECT INQUIRY =================
router.post("/reject/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    if (inquiry) {
      await sendMail(
        inquiry.email,
        "Inquiry Rejected - Fine Services",
        `
        Dear ${inquiry.name},

        We regret to inform you that your inquiry has been rejected.

        Regards,
        Fine Services
        `
      );
    }

    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Error rejecting inquiry. Please try again." });
  }
});

module.exports = router;
