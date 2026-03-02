const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We will keep this simple since it's an offline system
  role: { type: String, default: "Admin" },
});

module.exports = mongoose.model("User", userSchema);
