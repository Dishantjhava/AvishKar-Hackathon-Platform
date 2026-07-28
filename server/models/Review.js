const mongoose = require("mongoose");

const criterionScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true, min: 0 },
  feedback: { type: String, default: "" },
}, { _id: false });

const reviewSchema = new mongoose.Schema(
  {
    submission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true },
    judge: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scores: [criterionScoreSchema],
    totalScore: { type: Number, default: 0 },
    overallFeedback: { type: String, default: "" },
  },
  { timestamps: true }
);

reviewSchema.index({ submission: 1, judge: 1 }, { unique: true });

reviewSchema.pre("save", function (next) {
  this.totalScore = this.scores.reduce((sum, c) => sum + (c.score || 0), 0);
  next();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
