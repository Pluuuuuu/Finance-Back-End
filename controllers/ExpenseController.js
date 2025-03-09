const { Expense } = require('../models'); // Import the Expense model from the database

// Function to create a new expense
const createExpense = async (req, res) => {
    const currentDate = new Date(); // Get the current date
    const entryDate = new Date(req.body.date); // Parse the date from the request body

    // Validate that the expense date is not in the future
    if (entryDate > currentDate) {
        return res.status(400).json({ error: "Date cannot be in the future." });
    }

    // Validate that a category is provided
    if (!req.body.category) {
        return res.status(400).json({ error: "Category is required." });
    }

    try {
        // Extract data from the request body
        const { date, category, amount, title, message } = req.body;
        
        // Create a new expense record in the database
        const expense = await Expense.create({ date, category, amount, title, message });

        // Respond with the newly created expense
        res.status(201).json(expense);
    } catch (error) {
        console.error("Error creating expense:", error);
        res.status(500).json({ error: 'Failed to create expense' }); // Handle server errors
    }
};

// Function to retrieve all expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll(); // Fetch all expense records from the database
        res.json(expenses); // Send the expenses as JSON response
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: 'Failed to fetch expenses' }); // Handle server errors
    }
};

// Function to update an existing expense
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params; // Get the expense ID from request parameters
        const { title, message, amount, date } = req.body; // Extract updated fields from request body

        // Validate that all required fields are provided
        if (!title || !message || !amount || !date) {
            return res.status(400).json({ error: 'All fields are required for updating expense' });
        }

        // Find the expense by ID
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' }); // Handle case where expense does not exist
        }

        // Update the expense with new data
        await expense.update({ title, message, amount, date });

        // Respond with the updated expense
        res.status(200).json(expense);
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ error: 'Failed to update expense' }); // Handle server errors
    }
};

// Function to delete an expense by ID
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params; // Get the expense ID from request parameters

        // Find the expense by ID
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' }); // Handle case where expense does not exist
        }

        // Delete the expense from the database
        await expense.destroy();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: 'Failed to delete expense' }); // Handle server errors
    }
};

// Function to calculate the total expenses
const getTotalExpenses = async (req, res) => {
    try {
        // Use Sequelize's sum function to calculate the total amount spent
        const totalExpenses = await Expense.sum('amount'); // Sum all values in the 'amount' column
        res.status(200).json({ totalExpenses }); // Send the total expenses as JSON response
    } catch (error) {
        console.error("Error calculating total expenses:", error);
        res.status(500).json({ error: 'Failed to calculate total expenses' }); // Handle server errors
    }
};

// Export all functions to be used in routes
module.exports = { createExpense, getExpenses, updateExpense, deleteExpense, getTotalExpenses };
