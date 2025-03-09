
const sequelize = require("../db/db");
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");

router.post("/register", adminController.register);

module.exports = router;
