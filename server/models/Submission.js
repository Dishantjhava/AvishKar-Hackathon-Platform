const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true, trim: true },
    problemStatement: { type: String, required: true },
    solution: { type: String, required: true },
    description: { type: String, default: "" },
    githubRepo: { type: String, required: true },
    liveDemoUrl: { type: String, default: "" },
    techStack: { type: String, default: "" },
    demoVideoLink: { type: String, default: "" },
    screenshots: [String],
    presentationPdf: { type: String, default: "" },
    status: { type: String, enum: ["pending", "under_review", "approved", "rejected"], default: "pending" },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    hackathon: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon", required: true },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
