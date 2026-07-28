
const express = require("express");
const {
  createSubmission,
  getSubmissionById,
  getSubmissionsByHackathon,
  getMySubmission,
  updateSubmission,
  deleteSubmission,
  searchSubmissions,
} = require("../controllers/submissionController");
const { protect }   = require("../middleware/authMiddleware");
const { authorise } = require("../middleware/roleMiddleware");
const { upload, handleUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();

// GET /api/submissions/search?query=... — Feature 3: search submissions by projectName/techStack ($regex)
router.get("/search", protect, searchSubmissions);

// GET /api/submissions/mine — participant gets team submission
router.get("/mine", protect, authorise("participant"), getMySubmission);

// GET /api/submissions — query by hackathonId
router.get("/", protect, getSubmissionsByHackathon);

// GET /api/submissions/:id — single submission
router.get("/:id", protect, getSubmissionById);

// POST /api/submissions — participant submits project (with file uploads)
router.post(
  "/",
  protect,
  authorise("participant"),
  handleUpload(
    upload.fields([
      { name: "screenshots", maxCount: 5 },
      { name: "presentationPdf", maxCount: 1 },
    ])
  ),
  createSubmission
);

// PUT /api/submissions/:id — participant edits project submission (with file uploads)
router.put(
  "/:id",
  protect,
  authorise("participant", "admin"),
  handleUpload(
    upload.fields([
      { name: "screenshots", maxCount: 5 },
      { name: "presentationPdf", maxCount: 1 },
    ])
  ),
  updateSubmission
);

// DELETE /api/submissions/:id — admin deletes submission
router.delete("/:id", protect, authorise("admin"), deleteSubmission);

module.exports = router;
