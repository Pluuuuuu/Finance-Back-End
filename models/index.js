const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config(); // Load environment variables from the .env file

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_PATH || path.join(__dirname, '../config/financev2.db'), // Use DATABASE_PATH from .env or fallback to default
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Category = require('./Category')(sequelize, Sequelize);
db.Expense = require('./Expense')(sequelize, Sequelize);

module.exports = db;
