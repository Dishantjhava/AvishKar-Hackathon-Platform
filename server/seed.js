/**
 * AVISHKAR Demo Data Seed Script
 * ---------------------------------------------------------------
 * SAFE MODE: Only inserts missing demo data. Never deletes existing
 * users, hackathons, or any other real data you've created.
 * 
 * Run with:  node seed.js
 * Force wipe: node seed.js --force   (only if you really want to reset)
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const User         = require("./models/User");
const Hackathon    = require("./models/Hackathon");
const Team         = require("./models/Team");
const Registration = require("./models/Registration");
const Submission   = require("./models/Submission");
const Review       = require("./models/Review");

const FORCE_WIPE = process.argv.includes("--force");

/* ── helper: find or create a user by email ──────────────────── */
const findOrCreateUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    console.log(`  ↳ Skipped (already exists): ${data.email}`);
    return existing;
  }
  const user = await User.create(data);
  console.log(`  ↳ Created: ${data.email}`);
  return user;
};

/* ── helper: find or create a hackathon by title ─────────────── */
const findOrCreateHackathon = async (data) => {
  const existing = await Hackathon.findOne({ title: data.title });
  if (existing) {
    console.log(`  ↳ Skipped (already exists): ${data.title}`);
    return existing;
  }
  const h = await Hackathon.create(data);
  console.log(`  ↳ Created: ${data.title}`);
  return h;
};

/* ── main seed ────────────────────────────────────────────────── */
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    /* ── FORCE WIPE mode (opt-in only) ─────────────────────── */
    if (FORCE_WIPE) {
      console.log("⚠️  --force flag detected. Wiping all collections...");
      await Promise.all([
        User.deleteMany({}),
        Hackathon.deleteMany({}),
        Team.deleteMany({}),
        Registration.deleteMany({}),
        Submission.deleteMany({}),
        Review.deleteMany({}),
      ]);
      console.log("🗑️  All collections cleared.\n");
    } else {
      console.log("🛡️  Safe mode: existing data will NOT be touched.\n");
    }

    /* ── USERS ──────────────────────────────────────────────── */
    console.log("👤 Seeding users...");

    const admin = await findOrCreateUser({
      name: "Ritu Sharma",
      email: "admin@avishkar.dev",
      password: "Admin@123",
      role: "admin",
    });

    const organizer1 = await findOrCreateUser({
      name: "Karan Mehta",
      email: "karan.organizer@avishkar.dev",
      password: "Organizer@123",
      role: "organizer",
    });

    const organizer2 = await findOrCreateUser({
      name: "Neha Kapoor",
      email: "neha.organizer@avishkar.dev",
      password: "Organizer@123",
      role: "organizer",
    });

    const judge1 = await findOrCreateUser({
      name: "Dr. Sanjay Rao",
      email: "sanjay.judge@avishkar.dev",
      password: "Judge@123",
      role: "judge",
    });

    const judge2 = await findOrCreateUser({
      name: "Ananya Iyer",
      email: "ananya.judge@avishkar.dev",
      password: "Judge@123",
      role: "judge",
    });

    const participant1 = await findOrCreateUser({
      name: "Dishant Jhava",
      email: "dishant@avishkar.dev",
      password: "Participant@123",
      role: "participant",
    });

    const participant2 = await findOrCreateUser({
      name: "Rohan Verma",
      email: "rohan@avishkar.dev",
      password: "Participant@123",
      role: "participant",
    });

    const participant3 = await findOrCreateUser({
      name: "Priya Singh",
      email: "priya@avishkar.dev",
      password: "Participant@123",
      role: "participant",
    });

    /* ── HACKATHONS ─────────────────────────────────────────── */
    console.log("\n🏆 Seeding hackathons...");

    const hackathon1 = await findOrCreateHackathon({
      title: "HackIndia 2026",
      description:
        "A national-level hackathon focused on building AI-powered tools that solve real problems for Indian developers and small businesses. Open to student and early-career developer teams.",
      theme: "AI / ML & Agents",
      mode: "Hybrid",
      venue: "IIIT Delhi, New Delhi",
      startDate: new Date("2026-08-20"),
      endDate: new Date("2026-08-22"),
      registrationDeadline: new Date("2026-08-15"),
      prizePool: "₹5,00,000",
      maxTeamSize: 4,
      rules:
        "Teams must consist of 2-4 members. All code must be written during the 48-hour window. Use of open-source libraries is allowed; use of pre-built full applications is not.",
      judgingCriteria: [
        { name: "Innovation",           maxScore: 10 },
        { name: "Technical Complexity", maxScore: 10 },
        { name: "User Interface",       maxScore: 10 },
        { name: "Functionality",        maxScore: 10 },
        { name: "Scalability",          maxScore: 10 },
        { name: "Documentation",        maxScore: 10 },
        { name: "Presentation",         maxScore: 10 },
      ],
      status: "ongoing",
      registrationOpen: true,
      organizer: organizer1._id,
      judges: [judge1._id, judge2._id],
    });

    const hackathon2 = await findOrCreateHackathon({
      title: "FinTech Battle 2026",
      description:
        "Build the next generation of financial tools — from payment infrastructure to blockchain-based lending. Open to all skill levels, mentorship provided on Day 1.",
      theme: "Web3 & Blockchain",
      mode: "Online",
      venue: "Virtual",
      startDate: new Date("2026-08-25"),
      endDate: new Date("2026-08-27"),
      registrationDeadline: new Date("2026-08-20"),
      prizePool: "₹2,50,000",
      maxTeamSize: 3,
      rules:
        "Teams of up to 3 members. Projects must include a working demo deployed to a public URL by submission deadline.",
      judgingCriteria: [
        { name: "Innovation",           maxScore: 10 },
        { name: "Technical Complexity", maxScore: 10 },
        { name: "User Interface",       maxScore: 10 },
        { name: "Functionality",        maxScore: 10 },
        { name: "Scalability",          maxScore: 10 },
        { name: "Documentation",        maxScore: 10 },
        { name: "Presentation",         maxScore: 10 },
      ],
      status: "ongoing",
      registrationOpen: true,
      organizer: organizer2._id,
      judges: [judge1._id],
    });

    const hackathon3 = await findOrCreateHackathon({
      title: "GreenCode Summit",
      description:
        "A sustainability-focused hackathon for building tools that help track, reduce, or offset environmental impact — from carbon tracking apps to smart energy dashboards.",
      theme: "CleanTech & Sustainability",
      mode: "Offline",
      venue: "NIT Trichy Campus",
      startDate: new Date("2026-09-05"),
      endDate: new Date("2026-09-07"),
      registrationDeadline: new Date("2026-09-01"),
      prizePool: "₹1,50,000",
      maxTeamSize: 4,
      rules:
        "In-person attendance mandatory. Teams must present a working prototype, not just a concept.",
      judgingCriteria: [
        { name: "Innovation",           maxScore: 10 },
        { name: "Technical Complexity", maxScore: 10 },
        { name: "User Interface",       maxScore: 10 },
        { name: "Functionality",        maxScore: 10 },
        { name: "Scalability",          maxScore: 10 },
        { name: "Documentation",        maxScore: 10 },
        { name: "Presentation",         maxScore: 10 },
      ],
      status: "upcoming",
      registrationOpen: true,
      organizer: organizer1._id,
      judges: [judge2._id],
    });

    /* ── TEAMS (only if both hackathon & participants are newly created) ── */
    console.log("\n👫 Seeding teams...");

    let team1 = await Team.findOne({ name: "NeuralSquad" });
    if (!team1) {
      team1 = await Team.create({
        name: "NeuralSquad",
        leader: participant1._id,
        members: [participant1._id, participant2._id],
        hackathon: hackathon1._id,
      });
      console.log("  ↳ Created: NeuralSquad");
    } else {
      console.log("  ↳ Skipped (already exists): NeuralSquad");
    }

    let team2 = await Team.findOne({ name: "Innovators" });
    if (!team2) {
      team2 = await Team.create({
        name: "Innovators",
        leader: participant3._id,
        members: [participant3._id],
        hackathon: hackathon2._id,
      });
      console.log("  ↳ Created: Innovators");
    } else {
      console.log("  ↳ Skipped (already exists): Innovators");
    }

    /* ── REGISTRATIONS ──────────────────────────────────────── */
    console.log("\n📝 Seeding registrations...");

    const regPairs = [
      { participant: participant1._id, hackathon: hackathon1._id, team: team1._id },
      { participant: participant2._id, hackathon: hackathon1._id, team: team1._id },
      { participant: participant3._id, hackathon: hackathon2._id, team: team2._id },
    ];

    for (const r of regPairs) {
      const exists = await Registration.findOne({ participant: r.participant, hackathon: r.hackathon });
      if (!exists) {
        await Registration.create({ ...r, status: "approved" });
        console.log(`  ↳ Created registration for participant ${r.participant}`);
      } else {
        console.log(`  ↳ Skipped (already exists): registration for participant ${r.participant}`);
      }
    }

    /* ── SUBMISSIONS ────────────────────────────────────────── */
    console.log("\n📦 Seeding submissions...");

    let submission2;

    const sub1Exists = await Submission.findOne({ projectName: "AgentFlow AI" });
    if (!sub1Exists) {
      await Submission.create({
        projectName: "AgentFlow AI",
        problemStatement:
          "Developers spend hours manually reviewing pull requests and refactoring repetitive code patterns, slowing down engineering velocity.",
        solution:
          "An autonomous LLM agent that reviews pull requests, suggests refactors, and flags potential bugs before human review — integrated directly into GitHub workflows.",
        githubRepo: "https://github.com/example/agentflow-ai",
        liveDemoUrl: "https://agentflow-ai-demo.vercel.app",
        techStack: "React, Node.js, OpenAI API, MongoDB",
        demoVideoLink: "https://youtube.com/watch?v=example1",
        team: team1._id,
        hackathon: hackathon1._id,
        status: "under_review",
      });
      console.log("  ↳ Created: AgentFlow AI");
    } else {
      console.log("  ↳ Skipped (already exists): AgentFlow AI");
    }

    submission2 = await Submission.findOne({ projectName: "PayShield Web3" });
    if (!submission2) {
      submission2 = await Submission.create({
        projectName: "PayShield Web3",
        problemStatement:
          "Small merchants in emerging markets lack access to low-fee, fraud-resistant digital payment rails.",
        solution:
          "A blockchain-based micropayment gateway with built-in fraud detection, designed for small merchants with minimal transaction fees.",
        githubRepo: "https://github.com/example/payshield-web3",
        liveDemoUrl: "https://payshield-demo.vercel.app",
        techStack: "Solidity, React, Ethers.js, Express",
        demoVideoLink: "https://youtube.com/watch?v=example2",
        team: team2._id,
        hackathon: hackathon2._id,
        status: "approved",
      });
      console.log("  ↳ Created: PayShield Web3");
    } else {
      console.log("  ↳ Skipped (already exists): PayShield Web3");
    }

    /* ── REVIEWS ────────────────────────────────────────────── */
    console.log("\n⭐ Seeding reviews...");

    const reviewExists = await Review.findOne({ submission: submission2._id, judge: judge1._id });
    if (!reviewExists) {
      await Review.create({
        submission: submission2._id,
        judge: judge1._id,
        scores: [
          { name: "Innovation",           score: 9, feedback: "Genuinely novel approach to merchant fraud detection." },
          { name: "Technical Complexity", score: 8, feedback: "Solid smart contract implementation." },
          { name: "User Interface",       score: 7, feedback: "Clean but could use more onboarding guidance." },
          { name: "Functionality",        score: 8, feedback: "Core flow works end-to-end as demoed." },
          { name: "Scalability",          score: 7, feedback: "Would need load testing before production use." },
          { name: "Documentation",        score: 8, feedback: "README is clear and setup steps are easy to follow." },
          { name: "Presentation",         score: 9, feedback: "Confident, well-structured demo." },
        ],
        overallFeedback:
          "Strong entry with real-world applicability. Focus next on load testing and onboarding UX.",
      });
      console.log("  ↳ Created: Review for PayShield Web3");
    } else {
      console.log("  ↳ Skipped (already exists): Review for PayShield Web3");
    }

    /* ── DONE ───────────────────────────────────────────────── */
    console.log("\n✅ Seed complete!\n");
    console.log("Demo login credentials:");
    console.log("  Admin:        admin@avishkar.dev        / Admin@123");
    console.log("  Organizer:    karan.organizer@avishkar.dev / Organizer@123");
    console.log("  Judge:        sanjay.judge@avishkar.dev / Judge@123");
    console.log("  Participant:  dishant@avishkar.dev      / Participant@123");
    console.log("\n💡 Tip: run with --force flag to wipe and reset all data.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seed();
