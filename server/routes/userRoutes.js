
const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUser,
  deleteUser,
  toggleBlockUser,
  getPlatformStats,
} = require("../controllers/userController");
const { protect }   = require("../middleware/authMiddleware");
const { authorise } = require("../middleware/roleMiddleware");

const router = express.Router();

// GET /api/users/stats — admin platform analytics
router.get("/stats", protect, authorise("admin"), getPlatformStats);

// GET /api/users — admin user directory list
router.get("/", protect, authorise("admin"), getAllUsers);

// GET /api/users/:id — fetch user profile by ID
router.get("/:id", protect, getUserById);

// PUT /api/users/:id/profile — user updates own profile
router.put("/:id/profile", protect, updateProfile);

// PUT /api/users/:id — Feature 3: admin edits user account details (name, email, role)
router.put("/:id", protect, authorise("admin"), updateUser);

// DELETE /api/users/:id — admin deletes user
router.delete("/:id", protect, authorise("admin"), deleteUser);

// PATCH /api/users/:id/block — admin blocks or unblocks user
router.patch("/:id/block", protect, authorise("admin"), toggleBlockUser);

module.exports = router;
