const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config(); 
const app = express();
const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret", // keep in .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // ✅ for local dev (use true only with HTTPS)
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
  })
);

app.use(express.static("public"));
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Routes 
const inquiryRoutes = require("./routes/inquiryRoutes");
app.use("/inquiry", inquiryRoutes);
// Home Route
app.get("/", (req, res) => {
  res.render("index", { title: "Accounting Firm" });
}); // ✅ Services Route
// app.get("/services", (req, res) => {
//   const services = [
//     { name: "Bookkeeping", description: "Maintain accurate financial records", price: 5000 },
//     { name: "Tax Filing", description: "Income tax and GST filing services", price: 3000 },
//     { name: "Payroll Management", description: "End-to-end payroll processing", price: 4000 },
//     { name: "Audit Support", description: "Assistance in statutory and internal audits", price: 7000 },
//   ];
//   res.render("service", {
//     firmName: "Shaikh & Co. Accounting Firm",
//     services
//   });
// }); 
// ✅ Services Route
app.get("/services", (req, res) => {
  const services = [
    {
      name: "Monthly Accounting Services",
      description: "Accounting with Bank Passbook update",
      documents: ["Bank Passbook"]
    },
    {
      name: "GST Registration",
      description: "One-time GST Registration service",
      documents: ["Aadhaar Card", "Electricity Bill", "PAN Card", "Photograph", "Email ID", "Mobile Number"]
    },
    {
      name: "GST Filing",
      description: "Monthly GST return filing",
      documents: ["Sales & Purchase Bills", "Bank Passbook"]
    },
    {
      name: "TDS Registration",
      description: "TDS Registration (requires TAN Number)",
      documents: ["PAN of Deductor", "Details of party on whom TDS is deducted"]
    },
    {
      name: "TDS Filing",
      description: "Quarterly TDS return filing (with monthly payments)",
      documents: ["PAN of Deductor", "Details of party on whom TDS is deducted"]
    },
    {
      name: "Partnership Firm Registration",
      description: "Includes drafting Partnership Deed & Registration"
    },
    {
      name: "LLP Formation",
      description: "LLP formation including DSC of partners"
    },
    {
      name: "ITR Filing - Salary Return",
      description: "Form 16 based Salary Return"
    },
    {
      name: "ITR Filing - Personal Return",
      description: "Personal Income Tax Return"
    },
    {
      name: "ITR Filing - Business Return",
      description: "Business Income Tax Return"
    },
    {
      name: "ITR Audit Filing",
      description: "For turnover above ₹2 Crore"
    },
    {
      name: "Udyam Registration",
      description: "Udyam MSME Registration",
      documents: ["Aadhaar", "PAN Card", "Bank Passbook"]
    },
    {
      name: "Gumasta License",
      description: "Shop and Establishment Registration",
      documents: ["Aadhaar", "PAN Card", "Bank Passbook", "Photograph & Signature", "Shop Photograph with Board"]
    }
  ];

  res.render("service", {
    firmName: "Fine services",
    services
  });
});
app.get("/about", (req, res) => {
  res.render("about"); // make sure about.ejs is inside views/
});

// ✅ Import Inquiry model
const Inquiry = require("./models/inquiry");
//✅ Admin Dashboard Route 
// app.get("/admin", async (req, res) => {
//   try {
//     const inquiries = await Inquiry.find().sort({ createdAt: -1 });
//     // latest first
//     res.render("admin", { inquiries });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching inquiries");
//   }
// });
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);
// Import email routes
const emailRoutes = require("./routes/emailRoutes");
app.use("/emailRoutes", emailRoutes);
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/upload", uploadRoutes);
// near top of app.js where you set static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ✅ MongoDB Connection 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
// ✅ Start Server (keep this at the bottom always) 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`🚀 Server running on http://localhost:${PORT}`);
});