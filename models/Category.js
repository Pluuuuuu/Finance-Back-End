const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Category extends Model {}

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('fixed', 'recurring'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Category',
<<<<<<< HEAD
});
=======
    tableName: 'Categories', // Ensure correct table name
  });
>>>>>>> michella

module.exports = Category;
}
