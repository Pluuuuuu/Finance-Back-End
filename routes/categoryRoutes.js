const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure this points to your SQLite connection file

// Get all categories
router.get("/", (req, res) => {
    db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to retrieve categories" });
            return;
        }
        res.json(rows);
    });
});

module.exports = router;
