const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, enum: ["Medicine", "Supply"], required: true },
  quantity: { type: Number, required: true, default: 0 },
  expirationDate: { type: Date, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Inventory", inventorySchema);
