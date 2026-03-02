const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to talk to this backend
app.use(express.json()); // Allows the server to understand JSON data from forms

// Database Connection
// Using 127.0.0.1 instead of localhost avoids some common Node.js connection bugs
const mongoURI = 'mongodb://127.0.0.1:27017/barangay_clinic';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to Local MongoDB Database'))
  .catch((err) => console.error('❌ Failed to connect to MongoDB:', err));

// A simple test route to make sure the server is alive
app.get('/api/status', (req, res) => {
  res.json({ message: 'Barangay Health Center API is running smoothly!' });
});

// Patient Routes
app.use('/api/patients', require('./routes/patients'));

// Auth Routes
app.use('/api/auth', require('./routes/auth'));

// Inventory Routes
app.use('/api/inventory', require('./routes/inventory'));

// Treatment Routes
app.use('/api/treatments', require('./routes/treatments'));

// We will add the actual routes (Patients, Inventory, etc.) right here later.

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});