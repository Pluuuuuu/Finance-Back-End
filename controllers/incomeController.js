const { Income } = require('../models');  // Assuming your Income model is defined
const express = require('express');
const router = express.Router(); // Initialize router
// Create a new income
  const createIncome = async (req, res) => {
  const currentDate = new Date();
  const entryDate = new Date(req.body.date);

  // Check if the date is in the future
  if (entryDate > currentDate) {
    return res.status(400).json({ error: "Date cannot be in the future." });
  }

  // Validate the necessary fields
  if (!req.body.title || !req.body.amount || !req.body.date || !req.body.category) {
    return res.status(400).json({ error: "All fields (title, amount, date, and category) are required." });
  }

  try {
    // Destructure the necessary data from the body
    const { date, category, amount, title, message } = req.body;
    
    // Create a new income entry
    const income = await Income.create({ date, category, amount, title, message });

    // Respond with the created income
    res.status(201).json(income);
  } catch (error) {
    console.error("Error creating income:", error);
    res.status(500).json({ error: 'Failed to create income' });
  }
};

// Get all income entries
const getIncomes = async (req, res) => {
    try {
      // Try to fetch all incomes from the database
      const incomes = await Income.findAll(); // Assuming you're using Sequelize ORM
      if (incomes.length === 0) {
        return res.status(404).json({ error: 'No incomes found' });
      }
      res.status(200).json(incomes); // Return the fetched incomes
    } catch (error) {
      console.error("Error fetching incomes:", error);
      res.status(500).json({ error: 'Failed to fetch incomes' });
    }
  };


// Create Income Route(by michella)
router.post("/api/incomes", async (req, res) => {
  try {
      const { date, category, amount, title, message } = req.body;

      // Validation for required fields
      if (!date || !category || !amount || !title) {
          return res.status(400).json({ error: "All fields except message are required." });
      }

      // Create new income record
      const newIncome = await Income.create({ date, category, amount, title, message });

      // Send response with the new income
      res.status(201).json(newIncome);
  } catch (error) {
      console.error("Error adding income:", error);
      res.status(500).json({ error: "Server error. Please try again later." });
  }
});

module.exports = { createIncome, getIncomes };

