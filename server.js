const express = require('express');
const mysql = require("mysql2");
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes'); // Import routes
const categoryRoutes = require('./routes/categoryRoutes'); // Import category routes
const timeout = require('connect-timeout');


dotenv.config();

connectDB(); // Connect to the database

const app = express();
// Middleware
app.use(express.json());
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Allow only the frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(timeout('60s')); // Set timeout to 60 seconds

// Use Routes
app.use('/api/expenses', expenseRoutes); // Use expense routes
app.use('/api/categories', categoryRoutes); // Use category routes


// Example API Endpoints for the home page
app.get('/api/summary', (req, res) => {
  // Your logic to fetch summary data
  const summary = {
      totalIncome: 10000, // Example data
      totalExpenses: 5000, // Example data
      netProfit: 5000 // Example data
  };
  res.status(200).json(summary);
});

app.get('/api/recent-activities', (req, res) => {
  // Your logic to fetch recent activities home page
  const recentActivities = [
      { id: 1, title: "Salary", amount: 3000, date: "2025-02-01" },
      { id: 2, title: "Groceries", amount: 150, date: "2025-02-05" }
  ];
  res.status(200).json(recentActivities);
});

app.get('/api/chart-data', (req, res) => {
  // Your logic to fetch chart data home page 
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
        console.error('Unable to connect to the database:', error);
        res.status(500).json({ message: 'Unable to connect to the database.', error: error.message });
    }
});

// Financial Summary Route (ensure authentication is properly handled)
app.get('/api/summary', async (req, res) => {
    const userId = req.user ? req.user.id : null; // Update this based on your authentication logic

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const [balance, expenses, goals] = await Promise.all([
            sequelize.query(
                'SELECT SUM(amount) as balance FROM transactions WHERE user_id = ? AND type = "income"',
                { replacements: [userId], type: sequelize.QueryTypes.SELECT }
            ),
            sequelize.query(
                'SELECT SUM(amount) as expenses FROM transactions WHERE user_id = ? AND type = "expense"',
                { replacements: [userId], type: sequelize.QueryTypes.SELECT }
            ),
            sequelize.query(
                'SELECT goal_name, target_amount, current_amount, progress_percentage FROM goals WHERE user_id = ?',
                { replacements: [userId], type: sequelize.QueryTypes.SELECT }
            ),
        ]);

        res.status(200).json({ balance, expenses, goals });
    } catch (error) {
        console.error('Error fetching financial summary:', error);
        res.status(500).json({ message: 'Unable to fetch financial summary', error: error.message });
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
    .catch(error => console.error('Error syncing database:', error));

module.exports = app; // If needed for testing
