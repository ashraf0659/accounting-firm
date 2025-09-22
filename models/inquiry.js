// models/inquiry.js
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
  message: String,
  // price: Number, 
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },

  // file fields
  documentPath: String,          // stored filename on disk (e.g. "ashraf_invoice_169xxx.pdf")
  documentOriginalName: String,  // original name user uploaded (e.g. "invoice.pdf")
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
