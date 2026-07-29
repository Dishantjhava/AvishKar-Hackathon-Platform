const express  = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getInviteDetails, acceptInvite } = require("../controllers/invitationController");

const router = express.Router();

// GET /api/invitations/:token — Public: fetch invite details for the AcceptInvite page
router.get("/:token", getInviteDetails);

// POST /api/invitations/:token/accept — Protected: logged-in user accepts the invite
router.post("/:token/accept", protect, acceptInvite);

module.exports = router;
