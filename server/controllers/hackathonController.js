const Hackathon = require("../models/Hackathon");
const User = require("../models/User");
const { isValidObjectId, validateHackathonDates } = require("../utils/validators");

// Escape special regex characters to prevent MongoServerError on invalid patterns
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAllHackathons = async (req, res) => {
  const { mode, status, organizerId, search, theme } = req.query;
  const filter = {};

  if (mode) filter.mode = mode;
  if (status) filter.status = status;
  if (organizerId) {
    if (!isValidObjectId(organizerId)) {
      return res.status(400).json({ message: "Invalid organizer ID format." });
    }
    filter.organizer = organizerId;
  }

  if (search) filter.title = { $regex: escapeRegex(search.trim()), $options: "i" };
  if (theme) filter.theme = { $regex: escapeRegex(theme.trim()), $options: "i" };

  const hackathons = await Hackathon.find(filter)
    .populate("organizer", "name email")
    .populate("judges", "name email role")
    .sort("-createdAt");

  res.json(hackathons);
};

const getHackathonById = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid hackathon ID format." });
  }

  const hackathon = await Hackathon.findById(req.params.id)
    .populate("organizer", "name email")
    .populate("judges", "name email role");

  if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
  res.json(hackathon);
};

const createHackathon = async (req, res) => {
  const { title, registrationDeadline, startDate, endDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Hackathon title is required." });
  }

  if (registrationDeadline && startDate && endDate) {
    const dateCheck = validateHackathonDates(registrationDeadline, startDate, endDate);
    if (!dateCheck.valid) {
      return res.status(400).json({ message: dateCheck.message });
    }
  }

  const data = { ...req.body, organizer: req.user._id };
  if (req.file) {
    data.bannerImage = `/uploads/${req.file.filename}`;
  }

  const hackathon = await Hackathon.create(data);
  res.status(201).json(hackathon);
};

const updateHackathon = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid hackathon ID format." });
  }

  const hackathon = await Hackathon.findById(req.params.id);
  if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

  if (hackathon.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to update this hackathon." });
  }

  const { registrationDeadline, startDate, endDate } = req.body;
  if (registrationDeadline && startDate && endDate) {
    const dateCheck = validateHackathonDates(registrationDeadline, startDate, endDate);
    if (!dateCheck.valid) {
      return res.status(400).json({ message: dateCheck.message });
    }
  }

  const data = { ...req.body };
  if (req.file) {
    data.bannerImage = `/uploads/${req.file.filename}`;
  }

  const updated = await Hackathon.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  res.json(updated);
};

const deleteHackathon = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid hackathon ID format." });
  }

  const hackathon = await Hackathon.findById(req.params.id);
  if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

  if (hackathon.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to delete this hackathon." });
  }

  await hackathon.deleteOne();
  res.json({ message: "Hackathon deleted successfully." });
};

const updateStatus = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid hackathon ID format." });
  }

  const { status, registrationOpen } = req.body;
  const hackathon = await Hackathon.findByIdAndUpdate(
    req.params.id,
    { ...(status && { status }), ...(registrationOpen !== undefined && { registrationOpen }) },
    { new: true }
  );

  if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
  res.json(hackathon);
};

const assignJudges = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid hackathon ID format." });
  }

  const hackathon = await Hackathon.findById(req.params.id);
  if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

  if (hackathon.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only the event organizer can assign judges." });
  }

  const { judgeIds, judgeId, action } = req.body;

  if (Array.isArray(judgeIds)) {
    for (const jId of judgeIds) {
      if (!isValidObjectId(jId)) {
        return res.status(400).json({ message: `Invalid judge ID format: ${jId}` });
      }
    }
    if (judgeIds.length > 0) {
      const validJudges = await User.find({ _id: { $in: judgeIds }, role: "judge" });
      if (validJudges.length !== judgeIds.length) {
        return res.status(400).json({ message: "One or more user IDs do not belong to users with the 'judge' role." });
      }
    }
    hackathon.judges = judgeIds;
  } else if (judgeId) {
    if (!isValidObjectId(judgeId)) {
      return res.status(400).json({ message: "Invalid judge ID format." });
    }
    const judgeUser = await User.findOne({ _id: judgeId, role: "judge" });
    if (!judgeUser) return res.status(400).json({ message: "Specified user is not a registered judge." });

    if (action === "remove") {
      hackathon.judges = hackathon.judges.filter((j) => j.toString() !== judgeId);
    } else {
      if (!hackathon.judges.map((j) => j.toString()).includes(judgeId)) {
        hackathon.judges.push(judgeId);
      }
    }
  } else {
    return res.status(400).json({ message: "Please provide judgeIds array or a judgeId with action." });
  }

  await hackathon.save();
  const updatedHackathon = await Hackathon.findById(hackathon._id)
    .populate("organizer", "name email")
    .populate("judges", "name email role");

  res.json(updatedHackathon);
};

module.exports = {
  getAllHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  updateStatus,
  assignJudges,
};
