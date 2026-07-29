# 📡 AVISHKAR — API Endpoint Specification

Comprehensive REST API reference for the **AVISHKAR** Hackathon Platform backend service.

---

## 🌐 Base URL
```text
http://localhost:5000/api
```

---

## 🔑 Authentication Headers
For protected endpoints, supply the JSON Web Token (JWT) in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 📋 API Route Reference Table

| Category | Method | Endpoint | Access Level | Description |
|:---|:---|:---|:---|:---|
| **Auth** | `POST` | `/api/auth/register` | Public | Register new user account |
| **Auth** | `POST` | `/api/auth/login` | Public | Sign in with email and password |
| **Auth** | `POST` | `/api/auth/google` | Public | Authenticate / Sign up via Google OAuth |
| **Auth** | `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |
| **Users** | `GET` | `/api/users` | Admin | Fetch all platform users list |
| **Users** | `PUT` | `/api/users/:id` | Admin | Update user role or toggle block status |
| **Users** | `DELETE` | `/api/users/:id` | Admin | Permanently delete user account |
| **Hackathons** | `GET` | `/api/hackathons` | Public | Fetch all hackathons (search & filters) |
| **Hackathons** | `GET` | `/api/hackathons/:id` | Public | Fetch single hackathon details |
| **Hackathons** | `POST` | `/api/hackathons` | Organizer / Admin | Create a new hackathon event |
| **Hackathons** | `PUT` | `/api/hackathons/:id` | Organizer / Admin | Update hackathon event details |
| **Hackathons** | `DELETE` | `/api/hackathons/:id` | Organizer / Admin | Delete hackathon event |
| **Registrations** | `POST` | `/api/registrations` | Participant | Register for a hackathon event |
| **Registrations** | `GET` | `/api/registrations/mine` | Participant | Fetch logged-in user's registrations |
| **Registrations** | `DELETE` | `/api/registrations/:id` | Participant | Cancel hackathon registration |
| **Teams** | `POST` | `/api/teams` | Participant | Create a new team |
| **Teams** | `GET` | `/api/teams/mine` | Participant | Fetch logged-in user's team |
| **Teams** | `GET` | `/api/teams/search` | Protected | Search teams by name query |
| **Teams** | `GET` | `/api/teams/:id` | Protected | Get team details by ID |
| **Teams** | `POST` | `/api/teams/:id/invite` | Participant (Leader) | Send Nodemailer email invitation |
| **Teams** | `GET` | `/api/teams/:id/invites` | Participant (Leader) | List pending email invitations |
| **Teams** | `DELETE` | `/api/teams/:id/members/:userId` | Participant (Leader) | Remove member from team |
| **Teams** | `POST` | `/api/teams/:id/leave` | Participant | Leave team |
| **Invitations** | `GET` | `/api/invitations/:token` | Public | Fetch invite token details |
| **Invitations** | `POST` | `/api/invitations/:token/accept` | Protected | Accept invite and join team |
| **Submissions** | `POST` | `/api/submissions` | Participant | Submit hackathon project |
| **Submissions** | `GET` | `/api/submissions/mine` | Participant | Fetch logged-in user's submissions |
| **Submissions** | `GET` | `/api/submissions` | Protected | Get submissions by hackathon ID |
| **Reviews** | `POST` | `/api/reviews` | Judge | Submit evaluation score for project |
| **Reviews** | `GET` | `/api/reviews/submission/:submissionId` | Protected | Fetch review scores for submission |
| **Leaderboard** | `GET` | `/api/leaderboard` | Public | Fetch overall leaderboard rankings |
| **Leaderboard** | `GET` | `/api/leaderboard/:hackathonId` | Public | Fetch live rankings for hackathon |

---

## 💡 Request & Response Payload Examples

### 1. User Registration (`POST /api/auth/register`)
**Request Body:**
```json
{
  "name": "Dishant Jhava",
  "email": "dishant@avishkar.dev",
  "password": "Participant@123",
  "role": "participant"
}
```
**Response (201 Created):**
```json
{
  "user": {
    "_id": "6a69bfa1e08f29cceb5af99b",
    "name": "Dishant Jhava",
    "email": "dishant@avishkar.dev",
    "role": "participant"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Send Team Invitation Email (`POST /api/teams/:id/invite`)
**Request Body:**
```json
{
  "email": "teammate@example.com"
}
```
**Response (200 OK):**
```json
{
  "message": "Invitation email sent successfully to teammate@example.com!",
  "inviteUrl": "http://localhost:5173/invite/4b708f3b675ecd7acaf9e0731e1b188d"
}
```

---

### 3. Accept Team Invitation (`POST /api/invitations/:token/accept`)
**Response (200 OK):**
```json
{
  "message": "You have successfully joined the team!",
  "team": {
    "_id": "6a69c5d1e08f29cceb5afbb4",
    "name": "NeuralSquad",
    "members": [
      { "_id": "6a69bfa1e08f29cceb5af99b", "name": "Dishant Jhava" },
      { "_id": "6a69c001e08f29cceb5af99f", "name": "Rohan Verma" }
    ]
  }
}
```

---

### 4. Submit Judge Review (`POST /api/reviews`)
**Request Body:**
```json
{
  "submissionId": "6a69d102e08f29cceb5afcc1",
  "scores": [
    { "criterionName": "Innovation", "score": 9 },
    { "criterionName": "Technical Complexity", "score": 8 },
    { "criterionName": "UI/UX", "score": 9 }
  ],
  "feedback": "Outstanding implementation of autonomous LLM PR refactoring!"
}
```
**Response (201 Created):**
```json
{
  "_id": "6a69d405e08f29cceb5afdd9",
  "submission": "6a69d102e08f29cceb5afcc1",
  "judge": "6a69c112e08f29cceb5afa01",
  "totalScore": 26,
  "feedback": "Outstanding implementation of autonomous LLM PR refactoring!"
}
```
