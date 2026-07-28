const Team = require("../models/Team");
const User = require("../models/User");
const Submission = require("../models/Submission");
const { isValidObjectId, isValidEmail } = require("../utils/validators");

const createTeam = async (req, res) => {
  const { name, hackathonId } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Team name is required." });
  }

  if (hackathonId && !isValidObjectId(hackathonId)) {
    return res.status(400).json({ message: "Invalid hackathon ID format." });
  }

  const team = await Team.create({
    name: name.trim(),
    hackathon: hackathonId,
    leader: req.user._id,
    members: [req.user._id],
  });
  res.status(201).json(team);
};

const getTeamById = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid team ID format." });
  }

  const team = await Team.findById(req.params.id)
    .populate("members", "name email")
    .populate("leader", "name email");

  if (!team) return res.status(404).json({ message: "Team not found" });
  res.json(team);
};

const updateTeam = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid team ID format." });
  }

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ message: "Team not found" });

  if (team.leader.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only the team leader can edit team details." });
  }

  const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteTeam = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid team ID format." });
  }

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ message: "Team not found" });

  if (team.leader.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only the team leader can delete this team." });
  }

  const existingSubmission = await Submission.findOne({ team: req.params.id });
  if (existingSubmission) {
    return res.status(400).json({
      message: "Cannot delete team with an active project submission. Delete the submission first.",
    });
  }

  await team.deleteOne();
  res.json({ message: "Team deleted successfully." });
};

const inviteMember = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid team ID format." });
  }

  const { email } = req.body;
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please provide a valid email address to invite." });
  }

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ message: "Team not found" });

  if (team.leader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the team leader can invite members." });
  }

  const userToInvite = await User.findOne({ email: email.toLowerCase().trim() });
  if (!userToInvite) return res.status(404).json({ message: "No user found with that email address." });

  if (team.members.includes(userToInvite._id)) {
    return res.status(400).json({ message: "User is already a member of this team." });
  }

  team.members.push(userToInvite._id);
  await team.save();
  res.json(team);
};

const removeMember = async (req, res) => {
  if (!isValidObjectId(req.params.id) || !isValidObjectId(req.params.userId)) {
    return res.status(400).json({ message: "Invalid team or member ID format." });
  }

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ message: "Team not found" });

  if (team.leader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the team leader can remove members." });
  }

  team.members = team.members.filter((m) => m.toString() !== req.params.userId);
  await team.save();
  res.json(team);
};

const leaveTeam = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid team ID format." });
  }

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ message: "Team not found" });

  if (team.leader.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "Team leader cannot leave the team. Transfer leadership or delete the team." });
  }

  team.members = team.members.filter((m) => m.toString() !== req.user._id.toString());
  await team.save();
  res.json({ message: "You have left the team." });
};

const transferLeadership = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid team ID format." });
  }

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ message: "Team not found" });

  if (team.leader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the current leader can transfer leadership." });
  }

  const { newLeaderId } = req.body;
  if (!isValidObjectId(newLeaderId)) {
    return res.status(400).json({ message: "Invalid new leader ID format." });
  }

  if (!team.members.includes(newLeaderId)) {
    return res.status(400).json({ message: "New leader must be a member of the team." });
  }

  team.leader = newLeaderId;
  await team.save();
  res.json(team);
};

const getMyTeam = async (req, res) => {
  const team = await Team.findOne({ members: req.user._id })
    .populate("members", "name email")
    .populate("leader", "name email");
  res.json(team || null);
};

const searchTeams = async (req, res) => {
  const { query } = req.query;
  if (!query || !query.trim()) return res.json([]);

  const teams = await Team.find({
    name: { $regex: query.trim(), $options: "i" },
  })
    .populate("members", "name email")
    .populate("leader", "name email")
    .populate("hackathon", "title");

  res.json(teams);
};

module.exports = {
  createTeam,
  getTeamById,
  updateTeam,
  deleteTeam,
  inviteMember,
  removeMember,
  leaveTeam,
  transferLeadership,
  getMyTeam,
  searchTeams,
};
