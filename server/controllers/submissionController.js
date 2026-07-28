const Submission = require("../models/Submission");
const Team = require("../models/Team");
const { isValidObjectId, isValidUrl } = require("../utils/validators");

const createSubmission = async (req, res) => {
  const { hackathonId, teamId, projectName, githubRepo, liveDemoUrl, ...rest } = req.body;

  if (!projectName || !projectName.trim()) {
    return res.status(400).json({ message: "Project name is required." });
  }

  if (!isValidObjectId(hackathonId) || !isValidObjectId(teamId)) {
    return res.status(400).json({ message: "Invalid hackathon or team ID format." });
  }

  if (githubRepo && !isValidUrl(githubRepo)) {
    return res.status(400).json({ message: "Please provide a valid GitHub repository URL (e.g. https://github.com/user/repo)." });
  }

  if (liveDemoUrl && !isValidUrl(liveDemoUrl)) {
    return res.status(400).json({ message: "Please provide a valid live demo URL." });
  }

  const existing = await Submission.findOne({ team: teamId, hackathon: hackathonId });
  if (existing) {
    return res.status(400).json({ message: "Your team has already submitted a project for this hackathon." });
  }

  const data = {
    ...rest,
    projectName: projectName.trim(),
    githubRepo,
    liveDemoUrl,
    hackathon: hackathonId,
    team: teamId,
  };

  if (req.files) {
    if (req.files.screenshots && req.files.screenshots.length > 0) {
      data.screenshots = req.files.screenshots.map((f) => `/uploads/${f.filename}`);
    }
    if (req.files.presentationPdf && req.files.presentationPdf.length > 0) {
      data.presentationPdf = `/uploads/${req.files.presentationPdf[0].filename}`;
    }
  }

  const submission = await Submission.create(data);
  res.status(201).json(submission);
};

const getSubmissionById = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid submission ID format." });
  }

  const sub = await Submission.findById(req.params.id)
    .populate("team", "name leader members")
    .populate("hackathon", "title theme");

  if (!sub) return res.status(404).json({ message: "Submission not found" });
  res.json(sub);
};

const getSubmissionsByHackathon = async (req, res) => {
  const { hackathonId } = req.query;
  if (hackathonId && !isValidObjectId(hackathonId)) {
    return res.status(400).json({ message: "Invalid hackathon ID format." });
  }

  const subs = await Submission.find({ hackathon: hackathonId }).populate("team", "name members");
  res.json(subs);
};

const getMySubmission = async (req, res) => {
  const team = await Team.findOne({ members: req.user._id });
  if (!team) return res.json(null);
  const sub = await Submission.findOne({ team: team._id });
  res.json(sub || null);
};

const updateSubmission = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid submission ID format." });
  }

  const sub = await Submission.findById(req.params.id);
  if (!sub) return res.status(404).json({ message: "Submission not found" });

  const team = await Team.findById(sub.team);
  if (!team || (!team.members.includes(req.user._id) && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Not authorized to update this submission." });
  }

  const { githubRepo, liveDemoUrl } = req.body;
  if (githubRepo && !isValidUrl(githubRepo)) {
    return res.status(400).json({ message: "Please provide a valid GitHub repository URL." });
  }
  if (liveDemoUrl && !isValidUrl(liveDemoUrl)) {
    return res.status(400).json({ message: "Please provide a valid live demo URL." });
  }

  const data = { ...req.body };
  if (req.files) {
    if (req.files.screenshots && req.files.screenshots.length > 0) {
      data.screenshots = req.files.screenshots.map((f) => `/uploads/${f.filename}`);
    }
    if (req.files.presentationPdf && req.files.presentationPdf.length > 0) {
      data.presentationPdf = `/uploads/${req.files.presentationPdf[0].filename}`;
    }
  }

  const updated = await Submission.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  res.json(updated);
};

const deleteSubmission = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid submission ID format." });
  }

  const sub = await Submission.findByIdAndDelete(req.params.id);
  if (!sub) return res.status(404).json({ message: "Submission not found" });
  res.json({ message: "Submission deleted successfully." });
};

const searchSubmissions = async (req, res) => {
  const { query } = req.query;
  if (!query || !query.trim()) return res.json([]);

  const term = query.trim();
  const submissions = await Submission.find({
    $or: [
      { projectName: { $regex: term, $options: "i" } },
      { techStack: { $regex: term, $options: "i" } },
    ],
  })
    .populate("team", "name members")
    .populate("hackathon", "title theme");

  res.json(submissions);
};

module.exports = {
  createSubmission,
  getSubmissionById,
  getSubmissionsByHackathon,
  getMySubmission,
  updateSubmission,
  deleteSubmission,
  searchSubmissions,
};
