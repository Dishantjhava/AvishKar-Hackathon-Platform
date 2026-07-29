const crypto         = require("crypto");
const Team           = require("../models/Team");
const User           = require("../models/User");
const Submission     = require("../models/Submission");
const TeamInvitation = require("../models/TeamInvitation");
const sendEmail      = require("../utils/sendEmail");
const { buildInviteEmail } = require("./invitationController");
const { isValidObjectId, isValidEmail } = require("../utils/validators");

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

  const team = await Team.findById(req.params.id).populate("hackathon", "title");
  if (!team) return res.status(404).json({ message: "Team not found" });

  if (team.leader.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only the team leader can invite members." });
  }

  const cleanEmail = email.toLowerCase().trim();

  // If user already exists and is already in team, reject
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser && team.members.includes(existingUser._id)) {
    return res.status(400).json({ message: "User is already a member of this team." });
  }

  // If an active pending invite exists, replace it so a fresh invite email can be sent
  await TeamInvitation.deleteMany({
    team: team._id,
    email: cleanEmail,
    status: "pending",
  });

  // Generate cryptographically secure token
  const token = crypto.randomBytes(32).toString("hex");

  // Invitation expires in 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await TeamInvitation.create({
    team: team._id,
    email: cleanEmail,
    invitedBy: req.user._id,
    token,
    expiresAt,
  });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const inviteUrl = `${clientUrl}/invite/${token}`;

  const html = buildInviteEmail({
    teamName: team.name,
    hackathonTitle: team.hackathon?.title || "a Hackathon",
    inviterName: req.user.name || "Your team leader",
    inviteUrl,
  });

  let emailSent = false;
  let emailError = "";
  try {
    await sendEmail({
      to: cleanEmail,
      subject: `Join team "${team.name}" on AVISHKAR!`,
      html,
    });
    emailSent = true;
  } catch (err) {
    emailError = err.message;
    console.error("Failed to send invitation email:", err);
  }

  if (emailSent) {
    res.json({
      message: `Invitation email sent successfully to ${cleanEmail}!`,
      inviteUrl,
    });
  } else {
    res.status(500).json({
      message: `Failed to send email to ${cleanEmail}: ${emailError || "SMTP connection issue"}. Check server logs.`,
    });
  }
};

const getPendingInvites = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid team ID format." });
  }

  const invites = await TeamInvitation.find({
    team: req.params.id,
    status: "pending",
    expiresAt: { $gt: new Date() },
  }).select("email createdAt expiresAt");

  res.json(invites);
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
    name: { $regex: escapeRegex(query.trim()), $options: "i" },
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
  getPendingInvites,
  removeMember,
  leaveTeam,
  transferLeadership,
  getMyTeam,
  searchTeams,
};
