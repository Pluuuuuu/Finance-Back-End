const express = require("express");
const app = express();
const { createExpense, getExpenses } = require('../controllers/ExpenseController');


// Import routes
const expenseRoutes = require("./routes/expenseRoutes"); // ✅ Ensure this points to the correct file

// Middleware
app.use(express.json());

// Use routes
app.use("/api/expenses", expenseRoutes); // ✅ Use the correct variable

// Route for adding a new expense
router.post('/', createExpense);

// Route for fetching all expenses (if needed)
router.get('/', getExpenses);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = router;


