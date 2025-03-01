const { Expense } = require('../models');

const createExpense = async (req, res) => {
  const currentDate = new Date();
  const entryDate = new Date(req.body.date);

  if (entryDate > currentDate) {
    return res.status(400).json({ error: "Date cannot be in the future." });
  }

  if (!req.body.category) {
    return res.status(400).json({ error: "Category is required." });
  }

  try {
    const { date, category, amount, title, message } = req.body;
    const expense = await Expense.create({ date, category, amount, title, message });
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

module.exports = { createExpense, getExpenses };
