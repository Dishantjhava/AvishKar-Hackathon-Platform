<div align="center">

# 🚀 AVISHKAR — Next-Gen Hackathon Management Platform

**A full-stack, enterprise-grade portal to organize, host, participate in, and evaluate hackathons seamlessly.**

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-E02567?style=for-the-badge&logo=mongodb&logoColor=white)](#-tech-stack)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#-tech-stack)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-000000?style=for-the-badge&logo=nodedotjs&logoColor=white)](#-tech-stack)
[![Nodemailer](https://img.shields.io/badge/Mailer-Nodemailer%20%2B%20Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](#-key-features)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-role-matrix">Role Matrix</a> •
  <a href="#-api-endpoints">API Endpoints</a>
</p>

---

</div>

## 📌 Overview

**AVISHKAR** is an end-to-end, multi-role hackathon orchestration ecosystem designed to bridge the gap between event organizers, developer teams, and industry judges. Built using the modern MERN stack and styled with custom glassmorphism design tokens and modern typography (`Outfit` & `Inter`), AVISHKAR handles everything from team creation and email-based invitations to live submission pipelines and multi-criteria evaluation scoring.

---

## 🔥 Key Features

### 👥 1. Dynamic Role-Based Ecosystem
- **Participant Dashboard**: Real-time stats on registered hackathons, team roster management, project submission portal, and score tracking.
- **Organizer Studio**: Create & manage hackathons, assign judges, manage event statuses (Live/Upcoming/Ended), and monitor registrations.
- **Judge Portal**: Dedicated evaluation suite with criterion-based score sliders (0–10 pts), weighted scoring models, and feedback text outputs.
- **Admin Command Center**: System-wide statistics monitoring user growth, active events, submission queues, and account role verification.

### ✉️ 2. Automated Email Team Invitation System
- **Token-Based Email Invites**: Team leaders invite members via email address; dispatches a styled HTML invitation via Nodemailer (Gmail SMTP).
- **Crypto-Secure URL Links**: Generates 32-byte cryptographically secure random tokens (`/invite/:token`) with a 7-day TTL expiration.
- **Smart Auth Redirect**: Intercepts unauthenticated invite recipients, directing them to Signup/Login with a `?redirect=` param to smoothly accept the invitation post-authentication.

### 🏆 3. Live Submissions & Leaderboard Scoring
- **Submission Engine**: Support for GitHub repository URLs, live demo links, multi-screenshot uploads, presentation PDFs, and tech stack tags.
- **Criteria-Based Scoring**: Submissions are evaluated against standard weighted metrics (Innovation, Technical Complexity, UI/UX, Functionality, Scalability, Presentation).
- **Real-Time Leaderboard**: Dynamically calculates aggregated judge scores to rank top-performing teams.

### 🛡️ 4. Security & Robust Data Architecture
- **Regex Injection Prevention**: Built-in `escapeRegex` sanitizer on all search controllers to prevent MongoDB `$regex` crash vulnerabilities.
- **Safe Data Seeding**: `seed.js` featuring safe find-or-create logic that populates demo data without purging user-created accounts.
- **JWT & Password Security**: Bcryptjs password hashing combined with JSON Web Token session authorization.

---

## 🏗️ System Architecture

```
                                  ┌───────────────────────────┐
                                  │   AVISHKAR React Client   │
                                  │     (Vite + Tailwind)     │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼ HTTP / REST
                                  ┌───────────────────────────┐
                                  │   Express.js API Server   │
                                  └──────┬─────────────┬──────┘
                                         │             │
                    ┌────────────────────┘             └────────────────────┐
                    ▼                                                       ▼
      ┌───────────────────────────┐                           ┌───────────────────────────┐
      │   MongoDB Atlas Cluster   │                           │     Nodemailer SMTP       │
      │  (Mongoose ORM Schemas)   │                           │    (Gmail App Password)   │
      └───────────────────────────┘                           └───────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 + Vite 8
- **Styling**: Vanilla CSS Design Tokens, Custom Themes (Light/Dark Mode), Tailwind Utilities
- **Typography**: `Outfit` (Headings/Display), `Inter` (Body Text)
- **Routing**: React Router v7
- **State & Fetching**: Custom `useFetch` & `useAuth` Hooks, Axios

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas via Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) + Bcryptjs
- **Email Delivery**: Nodemailer (Gmail SMTP integration)
- **File Storage**: Multer Disk Storage (Screenshots & PDFs)

---

## ⚡ Getting Started

### Prerequisites
- Node.js (`v18+` recommended)
- MongoDB Atlas database URI (or local MongoDB server)
- Gmail account with an **App Password** (for email invitations)

---

### 📥 1. Installation

Clone the repository and install root dependencies:

```bash
git clone https://github.com/Dishantjhava/AvishKar-Hackathon-Platform.git
cd AvishKar-Hackathon-Platform

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### ⚙️ 2. Environment Setup

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/avishkar?retryWrites=true&w=majority
JWT_SECRET=your_strong_random_secret_here
JWT_EXPIRE=7d

CLIENT_URL=https://avishkarr.vercel.app
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com

# Gmail SMTP Email Invitation Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM="AVISHKAR Platform <your_gmail@gmail.com>"
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=https://avishkar-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

---

### 🌱 3. Data Seeding (Optional)

Populate demo data (users, hackathons, teams, reviews) without overwriting existing accounts:

```bash
cd server
node seed.js

# To force reset all collections:
node seed.js --force
```

---

### 🚀 4. Running Locally

Run both client and server concurrently from the root directory:

```bash
# From the root directory:
npm run dev
```

- **Frontend Application**: `https://avishkarr.vercel.app`
- **Backend API**: `https://avishkar-backend.onrender.com`

---

## 👥 Role Matrix & Demo Credentials

| Role | Email | Password | Access Capabilities |
|:---|:---|:---|:---|
| 👑 **Admin** | `admin@avishkar.dev` | `Admin@123` | Platform analytics, user verification, total oversight |
| 🧑‍💼 **Organizer** | `karan.organizer@avishkar.dev` | `Organizer@123` | Create hackathons, assign judges, event lifecycle |
| ⚖️ **Judge** | `sanjay.judge@avishkar.dev` | `Judge@123` | Evaluate submissions, grade score metrics, add feedback |
| 💻 **Participant** | `dishant@avishkar.dev` | `Participant@123` | Form teams, email invites, submit projects, view leaderboard |

---

## 📡 API Endpoints Overview

### 🔑 Authentication (`/api/auth`)
- `POST /api/auth/signup` — Register a new account
- `POST /api/auth/login` — Sign in with email & password
- `POST /api/auth/google` — Authenticate via Google OAuth

### 🏆 Hackathons (`/api/hackathons`)
- `GET /api/hackathons` — List all hackathons (supports filtering & search)
- `GET /api/hackathons/:id` — Get single hackathon details
- `POST /api/hackathons` — Create hackathon (Organizers/Admin)
- `PUT /api/hackathons/:id` — Update event details

### 👫 Teams & Invitations (`/api/teams`, `/api/invitations`)
- `POST /api/teams` — Create a new team
- `GET /api/teams/mine` — Fetch logged-in user's team
- `POST /api/teams/:id/invite` — Send email invitation with secure token
- `GET /api/invitations/:token` — Fetch invitation token metadata (Public)
- `POST /api/invitations/:token/accept` — Accept team invite (Protected)

### 📦 Submissions & Leaderboard (`/api/submissions`, `/api/leaderboard`)
- `POST /api/submissions` — Submit project with repository and demo URLs
- `GET /api/submissions/mine` — Fetch team submission
- `POST /api/reviews` — Submit judge score evaluation
- `GET /api/leaderboard/:hackathonId` — Calculate & fetch top hackathon rankings

---

<div align="center">

**Built with ❤️ for Indian Developers & Hackathon Communities.**

</div>
