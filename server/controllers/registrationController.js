const Registration = require("../models/Registration");
const Hackathon = require("../models/Hackathon");
const Team = require("../models/Team");
const User = require("../models/User");
const { isValidObjectId } = require("../utils/validators");

const registerForHackathon = async (req, res) => {
  const { hackathonId, teamId } = req.body;

  if (!isValidObjectId(hackathonId)) {
    return res.status(400).json({ message: "Invalid hackathon ID format." });
  }

  if (teamId && !isValidObjectId(teamId)) {
    return res.status(400).json({ message: "Invalid team ID format." });
  }

  const hackathon = await Hackathon.findById(hackathonId);
  if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

  if (!hackathon.registrationOpen) {
    return res.status(400).json({ message: "Registrations are currently closed for this hackathon." });
  }

  const existing = await Registration.findOne({
    hackathon: hackathonId,
    participant: req.user._id,
  });

  if (existing) {
    return res.status(400).json({ message: "You are already registered for this hackathon." });
  }

  const registration = await Registration.create({
    hackathon: hackathonId,
    participant: req.user._id,
    team: teamId || null,
    status: "approved",
  });

  res.status(201).json(registration);
};

const getMyRegistrations = async (req, res) => {
  const registrations = await Registration.find({ participant: req.user._id })
    .populate("hackathon", "title theme mode startDate endDate")
    .populate("team", "name");
  res.json(registrations);
};

const getRegistrationsByHackathon = async (req, res) => {
  if (!isValidObjectId(req.params.hackathonId)) {
    return res.status(400).json({ message: "Invalid hackathon ID format." });
  }

  const registrations = await Registration.find({ hackathon: req.params.hackathonId })
    .populate("participant", "name email")
    .populate("team", "name");
  res.json(registrations);
};

const updateRegistrationStatus = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid registration ID format." });
  }

  const { status } = req.body;
  const registration = await Registration.findByIdAndUpdate(req.params.id, { status }, { new: true });

  if (!registration) return res.status(404).json({ message: "Registration not found" });
  res.json(registration);
};

const cancelRegistration = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid registration ID format." });
  }

  const registration = await Registration.findById(req.params.id);
  if (!registration) {
    return res.status(404).json({ message: "Registration not found" });
  }

  if (registration.participant.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to cancel this registration." });
  }

  await registration.deleteOne();
  res.json({ message: "Registration cancelled successfully." });
};

module.exports = {
  registerForHackathon,
  getMyRegistrations,
  getRegistrationsByHackathon,
  updateRegistrationStatus,
  cancelRegistration,
};
