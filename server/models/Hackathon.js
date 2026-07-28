const mongoose = require("mongoose");

const criterionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxScore: { type: Number, required: true, min: 1 },
}, { _id: false });

const hackathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    theme: { type: String, required: [true, "Theme is required"] },
    mode: { type: String, enum: ["Online", "Offline", "Hybrid"], required: true },
    venue: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    bannerImage: { type: String, default: "" },
    prizePool: { type: String, default: "TBD" },
    maxTeamSize: { type: Number, default: 4, min: 1 },
    rules: { type: String, default: "" },
    judgingCriteria: { type: [criterionSchema], default: [] },
    status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming" },
    registrationOpen: { type: Boolean, default: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    judges: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Hackathon = mongoose.model("Hackathon", hackathonSchema);
module.exports = Hackathon;
