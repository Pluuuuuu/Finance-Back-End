const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Category extends Model {}

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories', // Ensure correct table name
    timestamps: true // Ensure timestamps are handled
  });

  return Category;
};