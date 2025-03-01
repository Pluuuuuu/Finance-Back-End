const express = require('express');
const mysql = require("mysql2");
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

dotenv.config();

connectDB(); // Connect to the database

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.use('/api/expenses', expenseRoutes); // Use expense routes
app.use('/api/categories', categoryRoutes); // Use category routes

// Test Route to check database connection
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
