const express = require('express');
const router = express.Router();
const { createExpense, getExpenses } = require('../controllers/ExpenseController');

// Route for adding a new expense
router.post('/', createExpense);

// Route for fetching all expenses (if needed)
router.get('/', getExpenses);

module.exports = router;
