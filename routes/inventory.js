const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// 1. ADD a new medicine/supply (POST)
router.post('/', async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: 'Error adding item', error: err.message });
  }
});

// 2. VIEW all inventory (GET)
// This will automatically sort items so the ones expiring soonest show up first!
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find().sort({ expirationDate: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory', error: err.message });
  }
});

// 3. GET LOW STOCK ALERTS (GET)
// A special route just for your dashboard to highlight items with less than 20 quantity
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({ quantity: { $lt: 20 } });
    res.json(lowStockItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching low stock', error: err.message });
  }
});

// 4. UPDATE stock or edit item (PUT)
// The nurse will use this to quickly add or deduct stock
router.put('/:id', async (req, res) => {
  try {
    // We add the 'lastUpdated' timestamp automatically whenever stock changes
    const updatedData = { ...req.body, lastUpdated: Date.now() };
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id, 
      updatedData, 
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: 'Error updating item', error: err.message });
  }
});

// 5. DELETE an item (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
});

module.exports = router;