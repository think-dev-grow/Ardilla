const express = require("express");
const { register, getUser } = require("../controllers/auth");
const router = express.Router();

router.post("/register", register);

router.get("/user/:id", getUser);

module.exports = router;
