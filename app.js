// const express = require("express");
// const mongoose = require("mongoose");
// const path = require("path");
// require("dotenv").config(); 
// const app = express();
// const session = require("express-session");

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "supersecret", // keep in .env
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false } // ✅ for local dev (use true only with HTTPS)
//   })
// );

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
//   })
// );

// app.use(express.static("public"));
// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// // Routes 
// const inquiryRoutes = require("./routes/inquiryRoutes");
// app.use("/inquiry", inquiryRoutes);
// // Home Route
// app.get("/", (req, res) => {
//   res.render("index", { title: "Accounting Firm" });
// }); 
// app.get("/services", (req, res) => {
//   const services = [
//     {
//       name: "Monthly Accounting Services",
//       description: "Accounting with Bank Passbook update",
//       documents: ["Bank Passbook"]
//     },
//     {
//       name: "GST Registration",
//       description: "One-time GST Registration service",
//       documents: ["Aadhaar Card", "Electricity Bill", "PAN Card", "Photograph", "Email ID", "Mobile Number"]
//     },
//     {
//       name: "GST Filing",
//       description: "Monthly GST return filing",
//       documents: ["Sales & Purchase Bills", "Bank Passbook"]
//     },
//     {
//       name: "TDS Registration",
//       description: "TDS Registration (requires TAN Number)",
//       documents: ["PAN of Deductor", "Details of party on whom TDS is deducted"]
//     },
//     {
//       name: "TDS Filing",
//       description: "Quarterly TDS return filing (with monthly payments)",
//       documents: ["PAN of Deductor", "Details of party on whom TDS is deducted"]
//     },
//     {
//       name: "Partnership Firm Registration",
//       description: "Includes drafting Partnership Deed & Registration"
//     },
//     {
//       name: "LLP Formation",
//       description: "LLP formation including DSC of partners"
//     },
//     {
//       name: "ITR Filing - Salary Return",
//       description: "Form 16 based Salary Return"
//     },
//     {
//       name: "ITR Filing - Personal Return",
//       description: "Personal Income Tax Return"
//     },
//     {
//       name: "ITR Filing - Business Return",
//       description: "Business Income Tax Return"
//     },
//     {
//       name: "ITR Audit Filing",
//       description: "For turnover above ₹2 Crore"
//     },
//     {
//       name: "Udyam Registration",
//       description: "Udyam MSME Registration",
//       documents: ["Aadhaar", "PAN Card", "Bank Passbook"]
//     },
//     {
//       name: "Gumasta License",
//       description: "Shop and Establishment Registration",
//       documents: ["Aadhaar", "PAN Card", "Bank Passbook", "Photograph & Signature", "Shop Photograph with Board"]
//     }
//   ];

//   res.render("service", {
//     firmName: "Fine services",
//     services
//   });
// });
// app.get("/about", (req, res) => {
//   res.render("about"); // make sure about.ejs is inside views/
// });

// // ✅ Import Inquiry model
// const Inquiry = require("./models/inquiry");

// const adminRoutes = require("./routes/admin");
// app.use("/admin", adminRoutes);
// // Import email routes
// const emailRoutes = require("./routes/emailRoutes");
// app.use("/emailRoutes", emailRoutes);
// const uploadRoutes = require("./routes/uploadRoutes");
// app.use("/upload", uploadRoutes);
// // near top of app.js where you set static
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// // ✅ MongoDB Connection 
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));
// // ✅ Start Server (keep this at the bottom always) 
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
// console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const app = express();

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true on Render HTTPS
      maxAge: 30 * 60 * 1000 // 30 minutes
    }
  })
);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
const inquiryRoutes = require("./routes/inquiryRoutes");
const adminRoutes = require("./routes/admin");
const emailRoutes = require("./routes/emailRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/inquiry", inquiryRoutes);
app.use("/admin", adminRoutes);
app.use("/emailRoutes", emailRoutes);
app.use("/upload", uploadRoutes);

// Home Route
app.get("/", (req, res) => {
  res.render("index", { title: "Accounting Firm" });
});

// Services Route
app.get("/services", (req, res) => {
  const services = [
    { name: "Monthly Accounting Services", description: "Accounting with Bank Passbook update", documents: ["Bank Passbook"] },
    { name: "GST Registration", description: "One-time GST Registration service", documents: ["Aadhaar Card", "Electricity Bill", "PAN Card", "Photograph", "Email ID", "Mobile Number"] },
    { name: "GST Filing", description: "Monthly GST return filing", documents: ["Sales & Purchase Bills", "Bank Passbook"] },
    { name: "TDS Registration", description: "TDS Registration (requires TAN Number)", documents: ["PAN of Deductor", "Details of party on whom TDS is deducted"] },
    { name: "TDS Filing", description: "Quarterly TDS return filing (with monthly payments)", documents: ["PAN of Deductor", "Details of party on whom TDS is deducted"] },
    { name: "Partnership Firm Registration", description: "Includes drafting Partnership Deed & Registration" },
    { name: "LLP Formation", description: "LLP formation including DSC of partners" },
    { name: "ITR Filing - Salary Return", description: "Form 16 based Salary Return" },
    { name: "ITR Filing - Personal Return", description: "Personal Income Tax Return" },
    { name: "ITR Filing - Business Return", description: "Business Income Tax Return" },
    { name: "ITR Audit Filing", description: "For turnover above ₹2 Crore" },
    { name: "Udyam Registration", description: "Udyam MSME Registration", documents: ["Aadhaar", "PAN Card", "Bank Passbook"] },
    { name: "Gumasta License", description: "Shop and Establishment Registration", documents: ["Aadhaar", "PAN Card", "Bank Passbook", "Photograph & Signature", "Shop Photograph with Board"] }
  ];
  res.render("service", { firmName: "Fine Services", services });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on ${process.env.BASE_URL || `http://localhost:${PORT}`}`));
