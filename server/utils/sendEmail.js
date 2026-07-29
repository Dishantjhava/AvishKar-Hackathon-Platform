const nodemailer = require("nodemailer");

/**
 * sendEmail — Reusable email utility using Nodemailer + Gmail SMTP (or any SMTP).
 *
 * Required .env variables:
 *   EMAIL_HOST   — SMTP host     (e.g., smtp.gmail.com)
 *   EMAIL_PORT   — SMTP port     (e.g., 465 for SSL, 587 for TLS)
 *   EMAIL_USER   — SMTP user     (your Gmail address)
 *   EMAIL_PASS   — SMTP password (Gmail App Password — NOT your Google account password)
 *   EMAIL_FROM   — Sender label  (e.g., "AVISHKAR <avishkar.noreply@gmail.com>")
 *
 * If credentials are missing, we log a clear warning and skip sending
 * so the rest of the app continues working during development.
 *
 * @param {{ to: string, subject: string, html: string }} options
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, html }) => {
  // Guard: don't crash if SMTP isn't configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      "⚠️  [sendEmail] SMTP credentials not configured. Email not sent.\n" +
      "    Set EMAIL_USER and EMAIL_PASS in server/.env to enable email sending.\n" +
      `    Would have sent: "${subject}" → ${to}`
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || "smtp.gmail.com",
    port:   Number(process.env.EMAIL_PORT) || 465,
    secure: Number(process.env.EMAIL_PORT) !== 587, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from:    process.env.EMAIL_FROM || `"AVISHKAR" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ [sendEmail] Email sent → ${to} | MessageId: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ [sendEmail] Failed to send email to ${to}:`, err.message);
    throw err; // throw so controller can catch and report back if needed
  }
};

module.exports = sendEmail;
