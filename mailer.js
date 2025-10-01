// // mailer.js
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// // Create transporter using Gmail
// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_USER, // your Gmail address
// //     pass: process.env.EMAIL_PASS, // app password (not your normal password)
// //   },
// // });
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,            // use STARTTLS
//   secure: false,        // true = port 465, false = port 587
//   auth: {
//     user: process.env.EMAIL_USER, // your Gmail address
//     pass: process.env.EMAIL_PASS, // Gmail App Password (not normal password)
//   },
//   tls: {
//     rejectUnauthorized: false, // helps in local/dev environments
//   },
// });


// /**
//  * Send an email
//  * @param {string|string[]} to - Recipient email(s)
//  * @param {string} subject - Subject of the email
//  * @param {string} text - Plain text content
//  * @param {string} [html] - Optional HTML content
//  * @param {object[]} [attachments] - Optional attachments
//  */
// const sendMail = async (to, subject, text, html = null, attachments = []) => {
//   try {
//     await transporter.sendMail({
//       from: `"My Firm" <${process.env.EMAIL_USER}>`, // Nice display name
//       to,
//       subject,
//       text,
//       html, // Allows you to pass HTML content
//       attachments, // e.g. [{ filename: "file.pdf", path: "./uploads/file.pdf" }]
//     });

//     console.log("✅ Email sent successfully");
//   } catch (error) {
//     console.error("❌ Error sending email:", error.message);
//   }
// };

// module.exports = sendMail;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // literal string "apikey"
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendMail = async (to, subject, text, html = null) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // must be the verified sender
      to,
      subject,
      text,
      html,
    });
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

module.exports = sendMail;
