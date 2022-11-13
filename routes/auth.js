const express = require("express");
const { register, getUser, completeProfile } = require("../controllers/auth");
const router = express.Router();

router.post("/register", register);

router.get("/user/:id", getUser);

router.post("/complete-profile", completeProfile);

module.exports = router;
