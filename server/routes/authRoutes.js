const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  registerUser,
  verifyOtp,
  loginUser,
  getMyProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getMyProfile);

module.exports = router;
