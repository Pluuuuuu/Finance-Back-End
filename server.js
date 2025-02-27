const express = require('express');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db'); // Ensure sequelize is correctly imported

dotenv.config();

connectDB(); // Connect to the database

const app = express();

app.use(express.json());

// Test Route
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ message: 'Database connection has been established successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to connect to the database.', error: error.message });
  }
});
// Define your routes and other middleware
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
