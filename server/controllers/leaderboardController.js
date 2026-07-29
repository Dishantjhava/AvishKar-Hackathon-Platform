const Submission = require("../models/Submission");
const Review = require("../models/Review");
const { isValidObjectId } = require("../utils/validators");

const getLeaderboard = async (req, res) => {
  const { hackathonId } = req.params;

  let query = {};
  if (hackathonId) {
    if (!isValidObjectId(hackathonId)) {
      return res.status(400).json({ message: "Invalid hackathon ID format." });
    }
    query = { hackathon: hackathonId };
  }

  const submissions = await Submission.find(query).populate("team", "name");

  const entries = await Promise.all(
    submissions.map(async (sub) => {
      const reviews = await Review.find({ submission: sub._id });
      const avgScore = reviews.length
        ? Math.round(reviews.reduce((sum, r) => sum + r.totalScore, 0) / reviews.length)
        : 0;

      return {
        submissionId: sub._id,
        teamName: sub.team?.name || "Unknown",
        projectName: sub.projectName,
        totalScore: avgScore,
        reviewCount: reviews.length,
      };
    })
  );

  entries.sort((a, b) => b.totalScore - a.totalScore);
  const ranked = entries.map((e, i) => ({ ...e, rank: i + 1 }));

  res.json(ranked);
};

module.exports = { getLeaderboard };
