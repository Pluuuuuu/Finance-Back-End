const express = require("express");
const router = express.Router();
const superadminController = require("../controllers/SuperadminController");

// Routes authentication
router.post("/register", superadminController.register);
router.post("/login", superadminController.login);

module.exports = router;

