const mongoose = require("mongoose");

/**
 * TeamInvitation model
 * Tracks pending email invitations for team membership.
 * A token is generated per invite and emailed to the invitee.
 * Once accepted or expired, the invitation is no longer usable.
 */
const invitationSchema = new mongoose.Schema(
  {
    team:         { type: mongoose.Schema.Types.ObjectId, ref: "Team",  required: true },
    email:        { type: String, required: true, lowercase: true, trim: true },
    invitedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
    // Cryptographically random URL-safe token (64 hex chars)
    token:        { type: String, required: true, unique: true, index: true },
    status:       { type: String, enum: ["pending", "accepted", "expired"], default: "pending" },
    expiresAt:    { type: Date,   required: true }, // 7 days from creation
  },
  { timestamps: true }
);

// Auto-index for token lookups and TTL cleanup
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // MongoDB auto-deletes after expiry

const TeamInvitation = mongoose.model("TeamInvitation", invitationSchema);
module.exports = TeamInvitation;
