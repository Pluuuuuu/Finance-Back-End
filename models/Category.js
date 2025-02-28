const { Model, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

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
});

module.exports = Category;

