const express = require("express");
const { getAssignedSubmissions, submitReview, getReviewBySubmission, updateReview } = require("../controllers/reviewController");
const { protect }   = require("../middleware/authMiddleware");
const { authorise } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/assigned", protect, authorise("judge"), getAssignedSubmissions);
router.post("/", protect, authorise("judge"), submitReview);
router.get("/:submissionId", protect, getReviewBySubmission);
router.put("/:id", protect, authorise("judge"), updateReview);

module.exports = router;
