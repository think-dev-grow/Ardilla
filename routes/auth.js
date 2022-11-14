const express = require("express");
const { register, getUser, completeProfile } = require("../controllers/auth");
const { verifyToken } = require("../utils/verifyToken");
const router = express.Router();

router.post("/register", register);

router.get("/user/:id", verifyToken, getUser);

router.post("/complete-profile/:id", completeProfile);

module.exports = router;
