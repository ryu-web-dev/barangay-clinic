const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// 1. CREATE a new patient (POST)
router.post('/', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (err) {
    res.status(400).json({ message: 'Error saving patient', error: err.message });
  }
});

// 2. READ all patients (GET)
// We will add a simple search feature here so staff can search by name
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    // Searches for matching first or last names, case-insensitive
    const patients = await Patient.find({
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 }); // Newest first
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patients', error: err.message });
  }
});

// 3. READ a single patient by ID (GET)
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patient', error: err.message });
  }
});

// 4. UPDATE a patient's info (PUT)
router.put('/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Returns the updated document
    );
    res.json(updatedPatient);
  } catch (err) {
    res.status(400).json({ message: 'Error updating patient', error: err.message });
  }
});

// 5. DELETE a patient (DELETE) - Optional, mostly for mistakes
router.delete('/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting patient', error: err.message });
  }
});

module.exports = router;