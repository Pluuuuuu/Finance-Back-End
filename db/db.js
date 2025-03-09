/*const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'financev2.db') // Path to your SQLite database file
});

// Test the connection and handle errors
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;*/

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_PATH // Use the DATABASE_PATH from the .env file
});

// Test the connection and handle errors
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  //// Import the model here and associate it with Sequelize(by michella)
const Income = require('./models/income')(sequelize, Sequelize);

module.exports = sequelize;