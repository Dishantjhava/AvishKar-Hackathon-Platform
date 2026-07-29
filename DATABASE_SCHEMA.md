# 📊 AVISHKAR — Database Schema & Data Relationships

This document details the MongoDB data models, collection schemas, indexes, and entity-relationship models powering the **AVISHKAR** Hackathon Platform.

---

## 🏗️ Entity Relationship Model (ERD)

```
  ┌──────────────┐         1:N          ┌───────────────────┐
  │     User     ├─────────────────────►│  TeamInvitation   │
  └──────┬───────┘                      └─────────┬─────────┘
         │ 1:N                                    │ N:1
         ▼                                        ▼
  ┌──────────────┐         1:N          ┌───────────────────┐
  │ Registration │◄────────────────────┤       Team        │
  └──────┬───────┘                      └─────────┬─────────┘
         │ N:1                                    │ 1:1
         ▼                                        ▼
  ┌──────────────┐                      ┌───────────────────┐
  │  Hackathon   │◄────────────────────┤    Submission     │
  └──────┬───────┘         1:N          └─────────┬─────────┘
         │ 1:N                                    │ 1:N
         ▼                                        ▼
  ┌──────────────┐                      ┌───────────────────┐
  │    Review    ├─────────────────────►│      Review       │
  └──────────────┘                      └───────────────────┘
```

---

## 📑 Collection Schemas Breakdown

### 1. `users` Collection
Stores user profiles, role-based authorization attributes, and hashed authentication secrets.

```javascript
{
  _id: ObjectId,
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 }, // bcrypt hash
  role: { type: String, enum: ["participant", "organizer", "judge", "admin"], default: "participant" },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
  skills: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
```
- **Indexes**: `email` (Unique)

---

### 2. `hackathons` Collection
Contains hackathon event details, dates, prize pools, custom judging criteria metrics, and assigned judges.

```javascript
{
  _id: ObjectId,
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  theme: { type: String, required: true },
  mode: { type: String, enum: ["Online", "Offline", "Hybrid"], default: "Online" },
  prizePool: { type: String, required: true },
  maxTeamSize: { type: Number, required: true, min: 1, max: 10, default: 4 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  venue: { type: String, default: "Online" },
  rules: { type: String, default: "" },
  status: { type: String, enum: ["upcoming", "ongoing", "ended"], default: "upcoming" },
  organizer: { type: ObjectId, ref: "User", required: true },
  judges: [{ type: ObjectId, ref: "User" }],
  judgingCriteria: [
    {
      name: { type: String, required: true },
      maxScore: { type: Number, default: 10 }
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```
- **Indexes**: `title` (Text search), `organizer`, `status`

---

### 3. `registrations` Collection
Tracks individual participant enrollments for specific hackathons.

```javascript
{
  _id: ObjectId,
  user: { type: ObjectId, ref: "User", required: true },
  hackathon: { type: ObjectId, ref: "Hackathon", required: true },
  team: { type: ObjectId, ref: "Team", default: null },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
  createdAt: Date,
  updatedAt: Date
}
```
- **Indexes**: `user + hackathon` (Compound unique index to prevent duplicate enrollments)

---

### 4. `teams` Collection
Represents collaborative teams formed by participants for hackathon events.

```javascript
{
  _id: ObjectId,
  name: { type: String, required: true, trim: true },
  leader: { type: ObjectId, ref: "User", required: true },
  members: [{ type: ObjectId, ref: "User" }],
  hackathon: { type: ObjectId, ref: "Hackathon" },
  createdAt: Date,
  updatedAt: Date
}
```
- **Indexes**: `leader`, `members`, `name` (Regex search index)

---

### 5. `teaminvitations` Collection
Tracks email-based team invitation tokens, status lifecycle, and automatic TTL expiration.

```javascript
{
  _id: ObjectId,
  team: { type: ObjectId, ref: "Team", required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  invitedBy: { type: ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true }, // 32-byte hex token
  status: { type: String, enum: ["pending", "accepted", "expired"], default: "pending" },
  expiresAt: { type: Date, required: true }, // 7 days TTL
  createdAt: Date,
  updatedAt: Date
}
```
- **Indexes**: `token` (Unique indexed), `expiresAt` (MongoDB TTL index for automatic document deletion)

---

### 6. `submissions` Collection
Holds team project submissions, code repository URLs, live demo URLs, multi-image screenshots, and PDF decks.

```javascript
{
  _id: ObjectId,
  projectName: { type: String, required: true, trim: true },
  problemStatement: { type: String, default: "" },
  solution: { type: String, default: "" },
  githubRepo: { type: String, required: true },
  liveDemoUrl: { type: String, default: "" },
  techStack: { type: String, default: "" }, // Comma separated tags
  demoVideoLink: { type: String, default: "" },
  presentationPdf: { type: String, default: "" }, // File upload path
  screenshots: [{ type: String }],               // File upload paths
  hackathon: { type: ObjectId, ref: "Hackathon", required: true },
  team: { type: ObjectId, ref: "Team", required: true },
  status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
  createdAt: Date,
  updatedAt: Date
}
```
- **Indexes**: `hackathon`, `team` (Unique compound index to prevent duplicate submissions per event)

---

### 7. `reviews` Collection
Stores judge criteria scores and written evaluation feedback.

```javascript
{
  _id: ObjectId,
  submission: { type: ObjectId, ref: "Submission", required: true },
  judge: { type: ObjectId, ref: "User", required: true },
  scores: [
    {
      criterionName: { type: String, required: true },
      score: { type: Number, required: true, min: 0, max: 10 }
    }
  ],
  totalScore: { type: Number, required: true }, // Aggregated sum/average
  feedback: { type: String, default: "" },
  createdAt: Date,
  updatedAt: Date
}
```
- **Indexes**: `submission + judge` (Compound unique index — 1 evaluation per judge per submission)
