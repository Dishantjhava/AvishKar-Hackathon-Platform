const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    participant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hackathon: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

registrationSchema.index({ participant: 1, hackathon: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration;
