const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models'); // Import sequelize instance
const bodyParser = require('body-parser');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const incomeRoutes = require('./routes/IncomeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const timeout = require('connect-timeout');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(timeout('60s')); // Set timeout to 60 seconds

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/analysis', analysisRoutes);

/*
// Test Database Connection \\ add
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate(); // Try to authenticate the DB connection
    res.status(200).json({ message: 'Database connected successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed.', error: error.message });
  }
});
*/

// Example API Endpoints for the home page
app.get('/api/summary', (req, res) => {
  const summary = {
    totalIncome: 10000, // Example data
    totalExpenses: 5000, // Example data
    netProfit: 5000 // Example data
  };
  res.status(200).json(summary);
});

//Add an API Endpoint to Fetch Total Expenses
app.get('/api/total-expenses', async (req, res) => {
  try {
    const [result] = await sequelize.query('SELECT SUM(amount) as totalExpenses FROM Expenses');
    const totalExpenses = result[0].totalExpenses || 0;
    res.status(200).json({ totalExpenses });
  } catch (error) {
    console.error('Error fetching total expenses:', error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/recent-activities', (req, res) => {
  const recentActivities = [
    { id: 1, title: "Salary", amount: 3000, date: "2025-02-01" },
    { id: 2, title: "Groceries", amount: 150, date: "2025-02-05" }
  ];
  res.status(200).json(recentActivities);
});
app.get('/api/chart-data', (req, res) => {
  const chartData = {
    labels: ["January", "February", "March"],
    data: [3000, 2500, 5000] // Example data
  };
  res.status(200).json(chartData);
});


// Test Route
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ message: 'Database connection has been established successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to connect to the database.', error: error.message });
  }
});

// API to add an expense
app.post("/api/expenses", (req, res) => {
  const { title, amount, category, date } = req.body;

  if (!title || !amount || !category || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `INSERT INTO Expenses (title, amount, category, date) VALUES (?, ?, ?, ?)`;
  sequelize.query(sql, { replacements: [title, amount, category, date] })
    .then(([result, metadata]) => {
      res.json({ id: result.lastID, title, amount, category, date }); // Adjusted to use lastID for SQLite
    })
    .catch(err => {
      console.error("Error inserting expense:", err);
      res.status(500).json({ error: err.message });
    });
});

//API to get an expense
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await sequelize.query('SELECT * FROM Expenses', {
      type: sequelize.QueryTypes.SELECT
    });
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: err.message });
  }
});



//m
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


// Fetch financial summary
app.get('/api/summary', async (req, res) => {
  // Fetch financial summary for the logged-in user
  const userId = req.user.id;  // Assume user is authenticated and user ID is available
  try {
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

// Define the /api/categories endpoint
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Fixed' },
    { id: 2, name: 'Recurrent' },
    // Add more categories as needed
  ];
  res.status(200).json(categories);
});

// PUT route for updating an expense
/*app.put('/api/expenses/:id', async (req, res) => {
  const { id } = req.params; // Get the ID from the route parameter
  const { title, description, amount, date } = req.body; // Extract updated data from request body*/

  app.put("/api/expenses/:id", async (req, res) => {  
    try {
        const { title, message, amount, date } = req.body; // Use 'description' if that's the correct field
        const id = req.params.id;

        // Fetch the expense by ID
        const expense = await Expense.findByPk(id);  
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        // Update the expense fields
        await expense.update({ title, message, amount, date });

        // Send back the updated expense data with a success message
        res.status(200).json({
            message: 'Expense updated successfully',
            expense: expense // Returning updated expense data
        });
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ error: "Failed to update expense" });
    }
});


// Sync database and start the server
sequelize.sync()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => console.log('Error syncing database:', error));

  
