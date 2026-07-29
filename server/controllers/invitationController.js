const crypto         = require("crypto");
const TeamInvitation = require("../models/TeamInvitation");
const Team           = require("../models/Team");
const Hackathon      = require("../models/Hackathon");
const sendEmail      = require("../utils/sendEmail");

/* ── Email HTML template ──────────────────────────────────────────────── */
/**
 * Build a branded AVISHKAR invitation email.
 * @param {{ teamName, hackathonTitle, inviterName, inviteUrl }} params
 */
const buildInviteEmail = ({ teamName, hackathonTitle, inviterName, inviteUrl }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Team Invitation — AVISHKAR</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F5;font-family:'Inter',system-ui,-apple-system,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F4F5;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#E02567 0%,#FF6B9D 100%);padding:36px 40px 32px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.04em;">
                AvishKar<span style="color:rgba(255,255,255,0.6);">:</span>
              </h1>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.75);font-weight:500;letter-spacing:0.06em;text-transform:uppercase;">
                Hackathon Management Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#E02567;text-transform:uppercase;letter-spacing:0.08em;">
                Team Invitation
              </p>
              <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#0F141A;line-height:1.3;">
                You're invited to join <span style="color:#E02567;">${teamName}</span>
              </h2>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
                <strong style="color:#0F141A;">${inviterName}</strong> has invited you to join their team
                <strong style="color:#0F141A;">${teamName}</strong> for
                <strong style="color:#0F141A;">${hackathonTitle}</strong> on AVISHKAR.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <a href="${inviteUrl}"
                       style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#E02567,#FF6B9D);color:#ffffff;font-size:15px;font-weight:700;border-radius:10px;text-decoration:none;letter-spacing:0.01em;">
                      Accept Team Invitation →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background:#FDF2F5;border-radius:10px;padding:16px 20px;border:1px solid rgba(224,37,103,0.12);">
                    <p style="margin:0;font-size:13px;color:#64748B;line-height:1.6;">
                      ⏰ <strong>This invitation expires in 7 days.</strong><br />
                      📋 You'll need to log in or create an account to accept.<br />
                      🔒 Only the invited email address can use this link.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:20px 40px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
                If you weren't expecting this invitation, you can safely ignore this email.<br />
                This link will expire automatically.<br />
                <br />
                <a href="${process.env.CLIENT_URL || "http://localhost:5173"}" style="color:#E02567;text-decoration:none;font-weight:600;">
                  AVISHKAR Platform
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/* ── Controller: GET /api/invitations/:token ────────────────────────── */
/**
 * Public — no auth required.
 * Returns team + hackathon + inviter details so the AcceptInvite page can
 * display context before the user logs in.
 */
const getInviteDetails = async (req, res) => {
  const { token } = req.params;

  const invite = await TeamInvitation.findOne({ token })
    .populate("team",      "name members hackathon")
    .populate("invitedBy", "name email");

  if (!invite) {
    return res.status(404).json({ message: "Invitation not found. The link may be invalid." });
  }

  if (invite.status === "accepted") {
    return res.status(410).json({ message: "This invitation has already been accepted." });
  }

  if (invite.status === "expired" || invite.expiresAt < new Date()) {
    // Mark expired if not already
    if (invite.status !== "expired") {
      invite.status = "expired";
      await invite.save();
    }
    return res.status(410).json({ message: "This invitation has expired. Please ask the team leader to send a new invite." });
  }

  // Fetch hackathon title separately (team.hackathon is just an ID here)
  let hackathonTitle = "an upcoming hackathon";
  if (invite.team?.hackathon) {
    const hackathon = await Hackathon.findById(invite.team.hackathon).select("title");
    if (hackathon) hackathonTitle = hackathon.title;
  }

  res.json({
    teamName:       invite.team?.name || "Unknown Team",
    hackathonTitle,
    inviterName:    invite.invitedBy?.name || "A team leader",
    inviterEmail:   invite.invitedBy?.email,
    invitedEmail:   invite.email,
    memberCount:    invite.team?.members?.length || 0,
    expiresAt:      invite.expiresAt,
  });
};

/* ── Controller: POST /api/invitations/:token/accept ─────────────────── */
/**
 * Protected — logged-in user only.
 * Validates the token, adds the user to the team, marks invite accepted.
 */
const acceptInvite = async (req, res) => {
  const { token } = req.params;

  const invite = await TeamInvitation.findOne({ token }).populate("team");

  if (!invite) {
    return res.status(404).json({ message: "Invitation not found. The link may be invalid." });
  }

  if (invite.status === "accepted") {
    return res.status(410).json({ message: "This invitation has already been accepted." });
  }

  if (invite.status === "expired" || invite.expiresAt < new Date()) {
    invite.status = "expired";
    await invite.save();
    return res.status(410).json({ message: "This invitation has expired. Please ask the team leader to send a new invite." });
  }

  const team = invite.team;
  if (!team) {
    return res.status(404).json({ message: "The team associated with this invitation no longer exists." });
  }

  // Check if user is already a member
  const alreadyMember = team.members.some(
    (m) => m.toString() === req.user._id.toString()
  );
  if (alreadyMember) {
    return res.status(400).json({ message: "You are already a member of this team." });
  }

  // Fetch hackathon to check maxTeamSize
  if (team.hackathon) {
    const hackathon = await Hackathon.findById(team.hackathon).select("maxTeamSize");
    if (hackathon && team.members.length >= hackathon.maxTeamSize) {
      return res.status(400).json({
        message: `This team is already full. Maximum team size for this hackathon is ${hackathon.maxTeamSize}.`,
      });
    }
  }

  // Add user to team + mark invite accepted
  team.members.push(req.user._id);
  await team.save();

  invite.status = "accepted";
  await invite.save();

  // Return the updated team with populated members for immediate UI update
  const updatedTeam = await Team.findById(team._id)
    .populate("members", "name email")
    .populate("leader",  "name email");

  res.json({ message: "You have successfully joined the team!", team: updatedTeam });
};

module.exports = { getInviteDetails, acceptInvite, buildInviteEmail };
