
const express = require("express");
const {
  registerForHackathon,
  getMyRegistrations,
  getRegistrationsByHackathon,
  updateRegistrationStatus,
  cancelRegistration,
} = require("../controllers/registrationController");
const { protect }   = require("../middleware/authMiddleware");
const { authorise } = require("../middleware/roleMiddleware");

const router = express.Router();

// POST /api/registrations — participant registers
router.post("/", protect, authorise("participant"), registerForHackathon);

// GET /api/registrations/mine — participant gets own registrations
router.get("/mine", protect, authorise("participant"), getMyRegistrations);

// GET /api/registrations/hackathon/:hackathonId — organizer/admin views registrations
router.get("/hackathon/:hackathonId", protect, authorise("organizer", "admin"), getRegistrationsByHackathon);

// PATCH /api/registrations/:id/status — organizer/admin approves or rejects
router.patch("/:id/status", protect, authorise("organizer", "admin"), updateRegistrationStatus);

// DELETE /api/registrations/:id — participant cancels registration (Feature 1)
router.delete("/:id", protect, authorise("participant", "admin"), cancelRegistration);

module.exports = router;
