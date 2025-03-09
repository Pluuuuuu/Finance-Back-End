const express = require('express'); // Import Express framework
const dotenv = require('dotenv'); // Import dotenv to manage environment variables
const { sequelize } = require('./models'); // Import Sequelize instance from models
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const cors = require('cors'); // Middleware to handle Cross-Origin Resource Sharing (CORS)
const expenseRoutes = require('./routes/expenseRoutes'); // Import expense-related routes
const categoryRoutes = require('./routes/categoryRoutes'); // Import category-related routes
const timeout = require('connect-timeout'); // Middleware to handle request timeouts

// By Rawaa
/*const adminRoutes = require("./routes/AdminRoutes");
const superadminRoutes = require("./routes/SuperadminRoutes");
const authRoutes = require("./routes/authRoutes");*/

dotenv.config(); // Load environment variables

const app = express(); // Initialize Express application

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests only from this frontend URL
  methods: ['GET', 'POST'], // Restrict allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Define allowed headers
}));
app.use(bodyParser.json()); // Parse incoming JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(timeout('60s')); // Set request timeout limit to 60 seconds

// Define API routes
app.use('/api/expenses', expenseRoutes); // Expense management routes
app.use('/api/categories', categoryRoutes); // Category management routes

// Routes by Rawaa (commented out)
/*app.use("/api/admins", adminRoutes);
app.use("/api/superadmin", superadminRoutes);*/

// Example API endpoint for financial summary
app.get('/api/summary', (req, res) => {
  const summary = {
    totalIncome: 10000, // Example static data
    totalExpenses: 5000, // Example static data
    netProfit: 5000 // Example static data
  };
  res.status(200).json(summary);
});

// API to fetch total expenses from the database
app.get('/api/total-expenses', async (req, res) => {
  try {
    // Execute raw SQL query to calculate total expenses
    const [result] = await sequelize.query('SELECT SUM(amount) as totalExpenses FROM Expenses');
    const totalExpenses = result[0].totalExpenses || 0; // Default to 0 if no data found
    res.status(200).json({ totalExpenses });
  } catch (error) {
    console.error('Error fetching total expenses:', error);
    res.status(500).json({ error: error.message });
  }
});

// API to fetch recent financial activities
app.get('/api/recent-activities', (req, res) => {
  const recentActivities = [
    { id: 1, title: "Salary", amount: 3000, date: "2025-02-01" },
    { id: 2, title: "Groceries", amount: 150, date: "2025-02-05" }
  ];
  res.status(200).json(recentActivities);
});

// API to provide financial data for charts
app.get('/api/chart-data', (req, res) => {
  const chartData = {
    labels: ["January", "February", "March"], // Example labels
    data: [3000, 2500, 5000] // Example data points
  };
  res.status(200).json(chartData);
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate(); // Check if database connection is successful
    res.status(200).json({ message: 'Database connection has been established successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to connect to the database.', error: error.message });
  }
});

// API to add a new expense
app.post("/api/expenses", async (req, res) => {
  const { title, amount, category, date, message } = req.body;

  // Validate request body
  if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: "All fields are required" });
  }

  try {
      // Insert new expense record using raw SQL query
      const [result] = await sequelize.query(
          "INSERT INTO Expenses (title, amount, category, date, message) VALUES (?, ?, ?, ?, ?)",
          { replacements: [title, amount, category, date, message] }
      );

      res.status(201).json({ message: "Expense added successfully", expenseId: result.insertId });
  } catch (error) {
      console.error("Error adding expense:", error);
      res.status(500).json({ error: error.message });
  }
});

// API to retrieve all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    // Fetch all expenses from the database
    const expenses = await sequelize.query('SELECT * FROM Expenses', {
      type: sequelize.QueryTypes.SELECT
    });
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: err.message });
  }
});

// API to fetch financial summary for the logged-in user
app.get('/api/summary', async (req, res) => {
  const userId = req.user.id; // Assume user authentication provides user ID
  try {
    // Fetch balance, expenses, and financial goals in parallel
    const [balance, expenses, goals] = await Promise.all([
      sequelize.query('SELECT SUM(amount) as balance FROM transactions WHERE user_id = ? AND type = "income"', { replacements: [userId] }),
      sequelize.query('SELECT SUM(amount) as expenses FROM transactions WHERE user_id = ? AND type = "expense"', { replacements: [userId] }),
      sequelize.query('SELECT goal_name, target_amount, current_amount, progress_percentage FROM goals WHERE user_id = ?', { replacements: [userId] }),
    ]);

    res.status(200).json({ balance: balance[0][0].balance, expenses: expenses[0][0].expenses, goals });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch financial summary', error: error.message });
  }
});

// API to fetch categories
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Fixed' },
    { id: 2, name: 'Recurrent' },
  ];
  res.status(200).json(categories);
});

// API to update an expense
app.put("/api/expenses/:id", async (req, res) => {  
    try {
        const { title, message, amount, date } = req.body;
        const id = req.params.id;

        // Find expense by ID
        const expense = await Expense.findByPk(id);  
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        // Update the expense details
        await expense.update({ title, message, amount, date });

        res.status(200).json({
            message: 'Expense updated successfully',
            expense: expense // Return updated expense data
        });
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ error: "Failed to update expense" });
    }
});

// API to delete an expense
app.delete("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Delete expense record using raw SQL query
    await sequelize.query(
      `DELETE FROM Expenses WHERE id = ?`,
      { replacements: [id] }
    );

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: error.message });
  }
});

// Sync database and start server
sequelize.sync()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => console.log('Error syncing database:', error));

  
//m
app.use('/api/incomes', incomeRoutes);
//Add an API Endpoint to Fetch Total Income
app.get('/api/total-incomes', async (req, res) => {
  try {
    const [result] = await sequelize.query('SELECT SUM(amount) as totalIncomes FROM Incomes');
    const totalIncomes = result[0].totalIncomes || 0;
    res.status(200).json({ totalIncomes });
  } catch (error) {
    console.error('Error fetching total Incomes:', error);
    res.status(500).json({ error: error.message });
  }
});
//might remove
app.get('/api/recent-activities', (req, res) => {
  const recentActivities = [
    { id: 1, title: "Bonus", amount: 3000, date: "2025-02-05" },
    { id: 2, title: "June Salary", amount: 150, date: "2025-06-05" }
  ];
  res.status(200).json(recentActivities);
});
//might remove
app.get('/api/chart-data', (req, res) => {
  const chartData = {
    labels: ["January", "February", "March"],
    data: [3000, 2500, 5000] // Example data
  };
  res.status(200).json(chartData);
});
// API to add an income
app.post("/api/incomes", (req, res) => {
  const { title, amount, category, date } = req.body;

  if (!title || !amount || !category || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const sql = `INSERT INTO Incomes (title, amount, category, date) VALUES (?, ?, ?, ?)`;
  sequelize.query(sql, { replacements: [title, amount, category, date] })
    .then(([result, metadata]) => {
      res.json({ id: result.lastID, title, amount, category, date }); // Adjusted to use lastID for SQLite
    })
    .catch(err => {
      console.error("Error inserting income:", err);
      res.status(500).json({ error: err.message });
    });
});

//API to get an incomee
app.get('/api/incomes', async (req, res) => {
  try {
    const incomes = await sequelize.query('SELECT * FROM Incomes', {
      type: sequelize.QueryTypes.SELECT
    });
    res.status(200).json(incomes);
  } catch (err) {
    console.error('Error fetching incomes:', err);
    res.status(500).json({ error: err.message });
  }
});

//UPDATE

app.put("/api/incomes/:id", async (req, res) => {  
  try {
      const { title, message, amount, date } = req.body; // Use 'description' if that's the correct field
      const id = req.params.id;

      // Fetch the income by ID
      const income = await Income.findByPk(id);  
      if (!income) {
          return res.status(404).json({ error: "Income not found" });
      }

      // Update the income fields
      await income.update({ title, message, amount, date });

      // Send back the updated income data with a success message
      res.status(200).json({
          message: 'Income updated successfully',
          income: income // Returning updated income data
      });
  } catch (error) {
      console.error("Error updating income:", error);
      res.status(500).json({ error: "Failed to update income" });
  }
});
