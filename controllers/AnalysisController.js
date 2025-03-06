// controllers/AnalysisController.js
const { Income, Expense } = require('../models');
const { Op, Sequelize } = require('sequelize');

const getAnalysisData = async (req, res) => {
  const { timeFrame } = req.params; // 'daily', 'weekly', 'monthly', 'yearly'

  // Define date ranges for each timeframe
  const dateRanges = {
    daily: {
      [Op.gte]: Sequelize.literal('DATE("date") = CURRENT_DATE'), // today
    },
    weekly: {
      [Op.gte]: Sequelize.literal('DATE("date") >= DATE("now", "-7 days")'),
    },
    monthly: {
      [Op.gte]: Sequelize.literal('DATE("date") >= DATE("now", "-30 days")'),
    },
    yearly: {
      [Op.gte]: Sequelize.literal('DATE("date") >= DATE("now", "-365 days")'),
    },
  };

  const startDate = dateRanges[timeFrame];

  try {
    // Fetch income data based on timeframe
    const incomeData = await Income.findAll({
      where: {
        date: startDate,
      },
      attributes: [
        [Sequelize.fn('date', Sequelize.col('date')), 'date'],
        [Sequelize.fn('sum', Sequelize.col('amount')), 'totalIncome'],
      ],
      group: ['date'],
      raw: true,
    });

    // Fetch expense data based on timeframe
    const expenseData = await Expense.findAll({
      where: {
        date: startDate,
      },
      attributes: [
        [Sequelize.fn('date', Sequelize.col('date')), 'date'],
        [Sequelize.fn('sum', Sequelize.col('amount')), 'totalExpense'],
      ],
      group: ['date'],
      raw: true,
    });

    res.status(200).json({
      incomeData,
      expenseData,
    });
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    res.status(500).json({ error: 'Failed to fetch analysis data' });
  }
};

module.exports = { getAnalysisData };
