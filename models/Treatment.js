const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  visitDate: { type: Date, default: Date.now },
  vitalSigns: {
    bloodPressure: { type: String },
    temperature: { type: String },
    weight: { type: String },
  },
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  treatmentGiven: { type: String }, // What was done or prescribed
  attendingStaff: { type: String, required: true },
});

module.exports = mongoose.model("Treatment", treatmentSchema);
