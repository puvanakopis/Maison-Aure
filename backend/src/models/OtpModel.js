const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    reservationData: {
      customerName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "" },
      date: { type: String, required: true },
      time: { type: String, required: true },
      guests: { type: Number, required: true },
      notes: { type: String, default: "" },
      totalEstimated: { type: Number, default: 170 },
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index to automatically purge expired records
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OtpVerification", otpSchema);
