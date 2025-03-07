const Superadmin = require("../models/Superadmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Inscription (Register)
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verification if user exist
    const existingSuperadmin = await Superadmin.findOne({ where: { username } });
    if (existingSuperadmin) {
      return res.status(400).json({ error: "Username already taken." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Superadmin
    const newSuperadmin = await Superadmin.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Superadmin registered successfully.",
      superadmin: { id: newSuperadmin.id, username: newSuperadmin.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed." });
  }
};

// Connected (Login)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verification if user exist
    const superadmin = await Superadmin.findOne({ where: { username } });
    if (!superadmin) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Verification password
    const isPasswordValid = await bcrypt.compare(password, superadmin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Generate token JWT
    const token = jwt.sign({ id: superadmin.id, username: superadmin.username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
};
