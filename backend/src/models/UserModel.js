const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    name: { type: String, default: "Executive Maitre D'" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
