const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/ExpenseController');

// Route for adding a new expense
router.post('/', createExpense);

// Route for fetching all expenses (if needed)
router.get('/', getExpenses);

// Route for updating an expense
router.put('/:id', updateExpense);

// Route for deleting an expense
router.delete('/:id', deleteExpense);

module.exports = router;
