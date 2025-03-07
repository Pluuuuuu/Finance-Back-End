'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE fixed_incomes ADD CONSTRAINT check_date CHECK (date_time <= CURRENT_TIMESTAMP);'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE fixed_expenses ADD CONSTRAINT check_date CHECK (date_time <= CURRENT_TIMESTAMP);'
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE fixed_incomes DROP CONSTRAINT check_date;');
    await queryInterface.sequelize.query('ALTER TABLE fixed_expenses DROP CONSTRAINT check_date;');
  }
};
