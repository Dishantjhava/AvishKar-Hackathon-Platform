const User = require("../models/User");
const Hackathon = require("../models/Hackathon");
const Team = require("../models/Team");
const Submission = require("../models/Submission");
const { isValidObjectId, isValidEmail } = require("../utils/validators");

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").sort("-createdAt");
  res.json(users);
};

const getUserById = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

const updateProfile = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to update this profile." });
  }

  const { name, email } = req.body;
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { ...(name && { name: name.trim() }), ...(email && { email: email.toLowerCase().trim() }) },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json(updated);
};

const updateUser = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  const { name, email, role, isBlocked } = req.body;

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (name) user.name = name.trim();
  if (email) user.email = email.toLowerCase().trim();
  if (role) user.role = role;
  if (isBlocked !== undefined) user.isBlocked = isBlocked;

  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;

  res.json(updatedUser);
};

const deleteUser = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully." });
};

const toggleBlockUser = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  const { blocked } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: !!blocked }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: `User ${blocked ? "blocked" : "unblocked"} successfully.`, user });
};

const getPlatformStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalHackathons = await Hackathon.countDocuments();
  const totalTeams = await Team.countDocuments();
  const totalSubmissions = await Submission.countDocuments();

  res.json({ totalUsers, totalHackathons, totalTeams, totalSubmissions });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUser,
  deleteUser,
  toggleBlockUser,
  getPlatformStats,
};
