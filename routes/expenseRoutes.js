const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, updateExpense, deleteExpense, getTotalExpenses } = require('../controllers/ExpenseController');
// Route for adding a new expense
router.post('/', createExpense);

// Route for fetching all expenses 
router.get('/', getExpenses);

// Route for updating an expense
router.put('/:id', updateExpense);

// Route for fetching the total expenses
router.get('/total-expenses', getTotalExpenses); 

// Route for deleting an expense
router.delete('/:id', deleteExpense);

module.exports = router;
