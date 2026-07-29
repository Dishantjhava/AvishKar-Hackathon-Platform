
const express = require("express");
const {
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
} = require("../controllers/teamController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/teams/search?query=... — Search teams by name ($regex)
router.get("/search", protect, searchTeams);

// GET /api/teams/mine — Get logged-in user's team
router.get("/mine", protect, getMyTeam);

// POST /api/teams — Create team (Participants only)
router.post("/", protect, authorize("participant"), createTeam);

// GET /api/teams/:id — Get team details by ID (Read-only access for members/organizers)
router.get("/:id", protect, getTeamById);

// PUT /api/teams/:id — Team leader updates team details (Participants only)
router.put("/:id", protect, authorize("participant"), updateTeam);

// DELETE /api/teams/:id — Team leader deletes team (Participants only)
router.delete("/:id", protect, authorize("participant"), deleteTeam);

// POST /api/teams/:id/invite — Team leader invites member by email (Participants only)
router.post("/:id/invite", protect, authorize("participant"), inviteMember);

// GET /api/teams/:id/invites — Team leader views pending invites
router.get("/:id/invites", protect, authorize("participant"), getPendingInvites);

// DELETE /api/teams/:id/members/:userId — Team leader removes member (Participants only)
router.delete("/:id/members/:userId", protect, authorize("participant"), removeMember);

// POST /api/teams/:id/leave — Member leaves team (Participants only)
router.post("/:id/leave", protect, authorize("participant"), leaveTeam);

// PATCH /api/teams/:id/transfer — Team leader transfers leadership (Participants only)
router.patch("/:id/transfer", protect, authorize("participant"), transferLeadership);

module.exports = router;
