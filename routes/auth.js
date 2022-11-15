const express = require("express");
const {
  register,
  getUser,
  completeProfile,
  verifyOTP,
  resendOTP,
} = require("../controllers/auth");
const { verifyToken } = require("../utils/verifyToken");
const router = express.Router();

router.post("/register", register);

router.get("/user/:id", getUser);

router.post("/complete-profile/:id", completeProfile);

router.post("/verify-otp", verifyToken, verifyOTP);

router.put("/resend-otp", verifyToken, verifyOTP);

module.exports = router;
