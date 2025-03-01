const express = require('express');
const mysql = require("mysql2");
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db'); // Ensure sequelize is correctly imported
const bodyParser = require('body-parser');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes'); // Import routes
const categoryRoutes = require('./routes/categoryRoutes'); // Import category routes

dotenv.config();

connectDB(); // Connect to the database

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/expenses', expenseRoutes); // Use expense routes
app.use('/api/categories', categoryRoutes); // Use category routes

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

    const sql = `INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)`;
    db.query(sql, [title, amount, category, date], (err, result) => {
        if (err) {
            console.error("Error inserting expense:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, title, amount, category, date });
    });
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

        res.status(200).json({ balance, expenses, goals });
    } catch (error) {
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
    .catch(error => console.log('Error syncing database:', error));
