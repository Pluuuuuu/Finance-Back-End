const express = require('express');
const mysql = require("mysql2");
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db'); // Ensure sequelize is correctly imported
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const expenseRoutes = require('./routes/expenseRoutes');// Import routes
const categoryRoutes = require('./routes/categoryRoutes');

  dotenv.config();

connectDB(); // Connect to the database

const app = express();

app.use(express.json());

app.use("/expenses", expenseRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));