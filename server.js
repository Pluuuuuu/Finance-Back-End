const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models'); // Import sequelize instance from models
const bodyParser = require('body-parser');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes'); // Import routes
const categoryRoutes = require('./routes/categoryRoutes'); // Import category routes
const timeout = require('connect-timeout');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow only the frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(timeout('60s')); // Set timeout to 60 seconds

app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

// Example API Endpoints for the home page
app.get('/api/summary', (req, res) => {
  const summary = {
    totalIncome: 10000, // Example data
    totalExpenses: 5000, // Example data
    netProfit: 5000 // Example data
  };
  res.status(200).json(summary);
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

// Sync database and start the server
sequelize.sync()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => console.log('Error syncing database:', error));

  
const incomeRoutes = require('./routes/incomeRoutes');
app.use('/api/incomes', incomeRoutes);  // Use the income routes under '/api/incomes'
require('dotenv').config();
module.exports = {
  development: {
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE,
  },
};