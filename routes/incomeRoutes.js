const express = require('express');
const router = express.Router();
const { createIncome, getIncomes } = require('../controllers/incomeController');
/*
// Get all incomes
router.get('/', incomeController.getAllIncomes);

// Get a specific income
router.get('/:id', incomeController.getIncomeById);

// Add a new income
router.post('/', incomeController.createIncome);

// Update an existing income
router.put('/:id', incomeController.updateIncome);

// Delete an income
router.delete('/:id', incomeController.deleteIncome);
 */
// Route for adding a new income
router.post('/', createIncome);

// Route for fetching all incomes
router.get('/', getIncomes);

module.exports = router;
