const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

// Public admin login
router.post("/login", authController.login);

// Authenticated session check
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
