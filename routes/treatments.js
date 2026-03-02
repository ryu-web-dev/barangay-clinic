const express = require('express');
const router = express.Router();
const Treatment = require('../models/Treatment');

// 1. ADD a new treatment record (POST)
// The staff fills this out after a patient is examined
router.post('/', async (req, res) => {
  try {
    const newTreatment = new Treatment(req.body);
    const savedTreatment = await newTreatment.save();
    res.status(201).json(savedTreatment);
  } catch (err) {
    res.status(400).json({ message: 'Error adding treatment record', error: err.message });
  }
});

// 2. GET HISTORY for a specific patient (GET)
// We will use this to populate the history table on the Patient Profile screen
router.get('/patient/:patientId', async (req, res) => {
  try {
    const treatments = await Treatment.find({ patientId: req.params.patientId })
                                      .sort({ visitDate: -1 }) // Newest visits at the top
                                      .populate('patientId', 'firstName lastName'); // Pulls in the patient's name
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patient history', error: err.message });
  }
});

// 3. GET a specific treatment record by its ID (GET)
// We need this specifically for the Med Cert Generator!
router.get('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id)
                                     .populate('patientId'); // Gets all patient details for the cert
    if (!treatment) return res.status(404).json({ message: 'Treatment record not found' });
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching treatment record', error: err.message });
  }
});

// 4. UPDATE a treatment record (PUT) - In case the doctor made a typo
router.put('/:id', async (req, res) => {
  try {
    const updatedTreatment = await Treatment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedTreatment);
  } catch (err) {
    res.status(400).json({ message: 'Error updating record', error: err.message });
  }
});

module.exports = router;