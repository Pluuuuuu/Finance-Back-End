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

const updateExpense = async (req, res) => {
    try {
        const { id } = req.params; // Get the expense ID from request params
        const { title, description, amount, date } = req.body; // Extract updated fields

        if (!title || !description || !amount || !date) {
            return res.status(400).json({ error: 'All fields are required for updating expense' });
        }

        // Find the expense by ID
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        // Update the expense
        expense.title = title;
        expense.description = description;
        expense.amount = amount;
        expense.date = new Date(date); // Ensure date format is valid

        await expense.save(); // Save changes to the database
        res.status(200).json(expense); // Respond with the updated expense
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ error: 'Failed to update expense' });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params; // Get the expense ID from request params

        // Find the expense by ID
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        // Delete the expense
        await expense.destroy();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};

const getTotalExpenses = async (req, res) => {
    try {
        // Use Sequelize's sum function to calculate the total of the 'amount' column
        const totalExpenses = await Expense.sum('amount'); // Summing up the 'amount' column from the database
        res.status(200).json({ totalExpenses }); // Sending the result back as a response
    } catch (error) {
        console.error("Error calculating total expenses:", error);
        res.status(500).json({ error: 'Failed to calculate total expenses' });
    }
};

// Export all functions
module.exports = { createExpense, getExpenses, updateExpense, deleteExpense, getTotalExpenses };
