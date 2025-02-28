const Expense = require('../models/Expense');

// Validation for Past or Present Date (Restrict Future Entries)
const createExpense = async (req, res) => {
    const currentDate = new Date();
    const entryDate = new Date(req.body.date);

    if (entryDate > currentDate) {
        return res.status(400).json({ error: "Date cannot be in the future." });
    }

    // Ensure Category is Selected
    if (!req.body.category) {
        return res.status(400).json({ error: "Category is required." });
    }

    try {
        const { date, category, amount, title, message } = req.body;
        const expense = await Expense.create({ date, category, amount, title, message });
        res.status(201).json(expense);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to create expense' });
    }
};

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        res.json(expenses);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
};

module.exports = { createExpense, getExpenses };
