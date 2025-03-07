const Admin = require("../models/Admin");
const Superadmin = require("../models/Superadmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Common login function for both Admins and Superadmins
exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    let user;
    if (role === "admin") {
      user = await Admin.findOne({ where: { username } });
    } else if (role === "superadmin") {
      user = await Superadmin.findOne({ where: { username } });
    } else {
      return res.status(400).json({ error: "Invalid role. Use 'admin' or 'superadmin'." });
    }

    // Check if user exists
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username, role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login successful.", token, role });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
};
