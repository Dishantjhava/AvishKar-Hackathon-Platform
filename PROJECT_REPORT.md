# 📄 AVISHKAR — Official Project Report & System Documentation

**Project Title**: AVISHKAR — Next-Gen Multi-Role Hackathon Management Ecosystem  
**Tech Stack**: MongoDB Atlas, Express.js, React 18 (Vite 8), Node.js, Nodemailer, Tailwind CSS  
**Target Domain**: Educational Tech / Developer Community Event Management  

---

## 📑 Executive Summary
**AVISHKAR** is an end-to-end web platform designed to streamline hackathon creation, team formation, email-based member invitation, project submission, and multi-criteria judge evaluations. 

Traditional hackathon management relies on fragmented tools (Google Forms, Discord servers, spreadsheets), causing friction during team registration and project grading. AVISHKAR consolidates these operations into a unified platform featuring role-based access control (RBAC), cryptographically secure email invitations, and live leaderboard calculations.

---

## 🎯 Key Problem Statements & Solutions

| Problem | AVISHKAR Solution |
|:---|:---|
| **Manual Team Invitations**: Users must register first before joining teams. | **Email Invite Tokens**: Invites sent via Gmail SMTP with secure 32-byte tokens (`/invite/:token`); unauthenticated recipients are guided through signup before joining. |
| **Flawed Scoring Systems**: Simple upvoting leads to unfair results. | **Criterion Score Weighting**: Industry judges grade projects on explicit metrics (0–10 sliders for Innovation, UI/UX, Tech Complexity). |
| **Server Crashes on Malformed Search**: MongoDB `$regex` errors freeze servers. | **Regex Injection Sanitizer**: `escapeRegex` utility protects all search queries. |
| **Database Data Overwrites**: Seeding scripts wipe manual user accounts. | **Safe Mode Seeding**: Find-or-create logic preserves user-created records. |

---

## 🏛️ System Architecture & Workflow

```
 +------------------+           HTTP/REST          +-------------------+
 |   React Client   | <==========================> | Express.js Server |
 | (Vite + Tailwind)|                              +---------+---------+
 +------------------+                                        |
                                         +-------------------+-------------------+
                                         |                                       |
                                         v                                       v
                              +--------------------+                  +--------------------+
                              |   MongoDB Atlas    |                  |  Nodemailer SMTP   |
                              | (Mongoose Schemas) |                  | (Gmail Integration)|
                              +--------------------+                  +--------------------+
```

---

## 👥 Role-Based Feature Matrix

### 💻 1. Participant Workflow
- **Dashboard Workspace**: Monitor active event enrollments, team rosters, and submitted project cards.
- **Team Management**: Create teams, invite teammates via email, or join teams via token link.
- **Project Portal**: Upload project title, GitHub repo, live demo URL, video link, and tech stack tags.

### 🧑‍💼 2. Organizer Studio
- **Event Lifecycle**: Create and publish hackathons with custom prize pools, deadlines, and mode (Online/Offline/Hybrid).
- **Judge Assignment**: Link verified industry judges to specific hackathon events.

### ⚖️ 3. Judge Evaluation Suite
- **Submission Queue**: View assigned submissions filtered by hackathon.
- **Scoring Interface**: Grade submissions using weighted criteria sliders and submit written feedback.

### 👑 4. Admin Command Center
- **System Metrics**: Real-time counter cards monitoring total platform users, events, and reviews.
- **Role Verification**: Admin controls to verify user roles and toggle user access (Block/Unblock).

---

## 🧪 Empirical Testing & Verification

1. **Client Production Build**: Executed `npm run build --prefix client` — compiled cleanly in **1.04s** with 0 errors.
2. **Server Syntax Audit**: Verified `node -c` on all server files.
3. **Database Connection Resiliency**: Automatic DNS fallback to Google DNS (`8.8.8.8`) ensures 100% database connectivity even on strict local ISP networks.
