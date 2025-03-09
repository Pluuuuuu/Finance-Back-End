const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Superadmin = sequelize.define("Superadmin", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // createdAt et updatedAt seront gérés automatiquement
});

module.exports = Superadmin;
