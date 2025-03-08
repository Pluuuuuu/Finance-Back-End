const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '../config/financev2.db')
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Category = require('./Category')(sequelize, Sequelize);
db.Expense = require('./Expense')(sequelize, Sequelize);
db.Income = require('./Income')(sequelize, Sequelize); // Fixed issue

module.exports = db;
