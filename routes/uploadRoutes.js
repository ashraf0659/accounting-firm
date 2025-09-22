const express = require("express");
const multer = require("multer");
const path = require("path");
const Inquiry = require("../models/inquiry");

const router = express.Router();

// Configure storage (use client name + original filename)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: async (req, file, cb) => {
    try {
      const inquiry = await Inquiry.findById(req.params.id);
      if (!inquiry) return cb(new Error("Inquiry not found"));

      // Sanitize client name
      const safeName = inquiry.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      // Sanitize original filename (without extension)
      const originalName = path.basename(file.originalname, path.extname(file.originalname))
                            .replace(/\s+/g, "_")
                            .replace(/[^a-zA-Z0-9_]/g, "");
      const extension = path.extname(file.originalname);

      cb(null, `${safeName}_${originalName}${extension}`);
    } catch (err) {
      cb(err);
    }
  }
});
function fileFilter(req, file, cb) {
  const allowed = /pdf|jpg|jpeg|png|doc|docx/i;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only PDF, JPG, PNG, DOC, and DOCX files allowed"));
  }
}

// const upload = multer({ storage, fileFilter });

// const upload = multer({ storage });
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("❌ Only PDF, JPG, PNG, DOC, and DOCX files allowed"));
    }
  } // 5MB
});


// ✅ GET route: Show upload form
// router.get("/:id", async (req, res) => {
//   try {
//     const inquiry = await Inquiry.findById(req.params.id);
//     if (!inquiry) return res.status(404).send("Inquiry not found");

//     res.render("upload", { inquiry, message: null });
//   } catch (err) {
//     console.error("Error loading upload page:", err);
//     res.status(500).send("Error loading upload page");
//   }
// });

// // ✅ POST route: Handle upload
// router.post("/:id", upload.single("document"), async (req, res) => {
//   try {
//     const inquiry = await Inquiry.findById(req.params.id);
//     if (!inquiry) return res.status(404).send("Inquiry not found");

//     // Save uploaded filename
//     inquiry.documentPath = req.file.filename;
//     await inquiry.save();

//     // Stay on upload page with success message
//     res.render("upload", { inquiry, message: "✅ Document uploaded successfully!" });
//   } catch (err) {
//     console.error("Error uploading document:", err);
//     res.render("upload", { inquiry: { _id: req.params.id, service: "", name: "" }, message: "❌ Error uploading file" });
//   }
// });
// ✅ POST route: Handle upload
// router.post("/:id", upload.single("document"), async (req, res) => {
//   try {
//     const inquiry = await Inquiry.findById(req.params.id);
//     if (!inquiry) return res.status(404).send("Inquiry not found");

//     inquiry.documentPath = req.file.filename;
//     await inquiry.save();

//     // ✅ Redirect with success query param
//     res.redirect(`/upload/${inquiry._id}?success=true`);
//   } catch (err) {
//     console.error("Error uploading document:", err);
//     res.redirect(`/upload/${req.params.id}?success=false`);
//   }
// });
router.post("/:id", (req, res) => {
  upload.single("document")(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err.message);
      return res.redirect(`/upload/${req.params.id}?success=false&error=${encodeURIComponent(err.message)}`);
    }

    try {
      const inquiry = await Inquiry.findById(req.params.id);
      if (!inquiry) return res.status(404).send("Inquiry not found");

      inquiry.documentPath = req.file.filename;
      await inquiry.save();

      res.redirect(`/upload/${inquiry._id}?success=true`);
    } catch (error) {
      console.error("Server error:", error);
      res.redirect(`/upload/${req.params.id}?success=false&error=Server error`);
    }
  });
});


// ✅ GET route: Show upload form (with optional success message)
// router.get("/:id", async (req, res) => {
//   try {
//     const inquiry = await Inquiry.findById(req.params.id);
//     if (!inquiry) return res.status(404).send("Inquiry not found");

//     const success = req.query.success === "true";
//     const error = req.query.success === "false";

//     res.render("upload", {
//       inquiry,
//       message: success
//         ? "✅ Document uploaded successfully!"
//         : error
//         ? "❌ Error uploading file"
//         : null
//     });
//   } catch (err) {
//     console.error("Error loading upload page:", err);
//     res.status(500).send("Error loading upload page");
//   }
// });
router.get("/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).send("Inquiry not found");

    const success = req.query.success === "true";
    const error = req.query.error || null;

    res.render("upload", {
      inquiry,
      message: success ? "✅ Document uploaded successfully!" : null,
      query: { error }
    });
  } catch (err) {
    console.error("Error loading upload page:", err);
    res.status(500).send("Error loading upload page");
  }
});



module.exports = router;
