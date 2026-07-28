
const express = require("express");
const {
  getAllHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  updateStatus,
  assignJudges,
} = require("../controllers/hackathonController");
const { protect }   = require("../middleware/authMiddleware");
const { authorise } = require("../middleware/roleMiddleware");
const { upload, handleUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();

// GET /api/hackathons — public list
router.get("/", getAllHackathons);

// GET /api/hackathons/:id — public details
router.get("/:id", getHackathonById);

// POST /api/hackathons — organizer/admin creates hackathon (Feature 5: bannerImage upload)
router.post(
  "/",
  protect,
  authorise("organizer", "admin"),
  handleUpload(upload.single("bannerImage")),
  createHackathon
);

// PUT /api/hackathons/:id — organizer/admin updates hackathon (Feature 5: bannerImage upload)
router.put(
  "/:id",
  protect,
  authorise("organizer", "admin"),
  handleUpload(upload.single("bannerImage")),
  updateHackathon
);

// DELETE /api/hackathons/:id — organizer/admin deletes hackathon
router.delete("/:id", protect, authorise("organizer", "admin"), deleteHackathon);

// PATCH /api/hackathons/:id/status — organizer/admin updates status
router.patch("/:id/status", protect, authorise("organizer", "admin"), updateStatus);

// PATCH /api/hackathons/:id/judges — Feature 4: organizer assigns/removes judges
router.patch("/:id/judges", protect, authorise("organizer", "admin"), assignJudges);

module.exports = router;
