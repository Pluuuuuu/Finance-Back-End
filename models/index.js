const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../config/financev2.db') // Ensure this points to the correct location
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Category = require('./Category')(sequelize, Sequelize);
db.Expense = require('./Expense')(sequelize, Sequelize);
db.Expense = require('./income')(sequelize, Sequelize);

module.exports = db;
