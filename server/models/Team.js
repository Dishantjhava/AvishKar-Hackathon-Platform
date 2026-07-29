const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    leader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hackathon: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon" },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
