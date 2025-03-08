const express = require('express');
const router = express.Router();
const { createIncome, getIncomes } = require('../controllers/IncomeController');

// Route for adding a new income
router.post('/', createIncome);

// Route for fetching all 
router.get('/', getIncomes);


// Route for updating 
router.put('/:id', updateIncomes);

// Route for fetching the total expenses
router.get('/total-incomes', getTotalIncomes); 

// Route for deleting
router.delete('/:id', deleteIncomes);
module.exports = router;


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