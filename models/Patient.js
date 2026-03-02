const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
