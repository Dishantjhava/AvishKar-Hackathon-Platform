const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { isValidEmail, isStrongPassword } = require("../utils/validators");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Full name is required." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email address is required." });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address format (e.g. user@example.com)." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and contain at least one letter and one number.",
      });
    }

    // Admin role can't be self-assigned on signup
    const allowedSignupRoles = ["participant", "organizer", "judge"];
    const targetRole = allowedSignupRoles.includes(role) ? role : "participant";

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "This email address is already registered. Please log in instead." });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: targetRole,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "This email address is already registered. Please log in instead." });
    }
    res.status(500).json({ message: error.message || "Registration failed. Please try again." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked." });
    }

    const token = generateToken(user._id);
    res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Login failed. Please try again." });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { email, name, picture, role } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid Google email address is required." });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      const allowedGoogleRoles = ["participant", "organizer", "judge"];
      const targetRole = allowedGoogleRoles.includes(role) ? role : "participant";

      const randomPassword = `G_${Date.now()}_${Math.random().toString(36).substring(2, 9)}a1`;
      user = await User.create({
        name: name ? name.trim() : email.split("@")[0],
        email: email.toLowerCase().trim(),
        password: randomPassword,
        role: targetRole,
        profilePicture: picture || "",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked." });
    }

    const token = generateToken(user._id);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Google Auth Error:", error);
    res.status(500).json({ message: error.message || "Google authentication failed. Please try again." });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { signup, login, googleAuth, getMe };
