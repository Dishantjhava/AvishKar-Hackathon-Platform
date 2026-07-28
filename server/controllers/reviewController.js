const Review = require("../models/Review");
const Submission = require("../models/Submission");
const Hackathon = require("../models/Hackathon");
const { isValidObjectId } = require("../utils/validators");

const getAssignedSubmissions = async (req, res) => {
  const hackathons = await Hackathon.find({ judges: req.user._id });
  const hackathonIds = hackathons.map((h) => h._id);

  const submissions = await Submission.find({ hackathon: { $in: hackathonIds } })
    .populate("team", "name")
    .populate("hackathon", "title");

  const withReviewStatus = await Promise.all(
    submissions.map(async (s) => {
      const review = await Review.findOne({ submission: s._id, judge: req.user._id });
      return { ...s.toObject(), reviewed: !!review };
    })
  );

  res.json(withReviewStatus);
};

const submitReview = async (req, res) => {
  const { submissionId, scores } = req.body;

  if (!isValidObjectId(submissionId)) {
    return res.status(400).json({ message: "Invalid submission ID format." });
  }

  const sub = await Submission.findById(submissionId);
  if (!sub) return res.status(404).json({ message: "Submission not found" });

  const scoresArray = Object.entries(scores || {}).map(([name, val]) => ({
    name,
    score: Number(val.score) || 0,
    feedback: val.feedback || "",
  }));

  const review = await Review.create({
    submission: submissionId,
    judge: req.user._id,
    scores: scoresArray,
  });

  await Submission.findByIdAndUpdate(submissionId, { status: "under_review" });
  res.status(201).json(review);
};

const getReviewBySubmission = async (req, res) => {
  if (!isValidObjectId(req.params.submissionId)) {
    return res.status(400).json({ message: "Invalid submission ID format." });
  }

  const review = await Review.findOne({ submission: req.params.submissionId, judge: req.user._id });
  res.json(review || null);
};

const updateReview = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid review ID format." });
  }

  const { scores } = req.body;
  const scoresArray = Object.entries(scores || {}).map(([name, val]) => ({
    name,
    score: Number(val.score) || 0,
    feedback: val.feedback || "",
  }));

  const review = await Review.findByIdAndUpdate(req.params.id, { scores: scoresArray }, { new: true });
  if (!review) return res.status(404).json({ message: "Review not found" });
  res.json(review);
};

module.exports = { getAssignedSubmissions, submitReview, getReviewBySubmission, updateReview };
