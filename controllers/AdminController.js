const sequelize = require("../db/db");

const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    // Create the admin
    const newAdmin = await Admin.create({ username, password });

    res.status(201).json({
      message: "Admin successfully registered.",
      admin: { id: newAdmin.id, username: newAdmin.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Error during registration." });
  }
};

