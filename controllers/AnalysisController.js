const { Income, Expense } = require('../models');
const { Op, Sequelize } = require('sequelize');

const getAnalysisData = async (req, res) => {
  const { timeFrame } = req.params;

  // Define date ranges using JavaScript Date objects
  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 7);
  const last30Days = new Date();
  last30Days.setDate(today.getDate() - 30);
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);

  const dateRanges = {
    daily: { [Op.gte]: today },
    weekly: { [Op.gte]: last7Days },
    monthly: { [Op.gte]: last30Days },
    yearly: { [Op.gte]: lastYear },
  };

  // Validate timeFrame
  if (!dateRanges[timeFrame]) {
    return res.status(400).json({ error: "Invalid time frame. Use 'daily', 'weekly', 'monthly', or 'yearly'." });
  }

  try {
    // Fetch income data based on timeframe
    const incomeData = await Income.findAll({
      where: { date: dateRanges[timeFrame] },
      attributes: [
        [Sequelize.fn('strftime', '%Y-%m-%d', Sequelize.col('date')), 'date'], // Group by date
        [Sequelize.fn('sum', Sequelize.col('amount')), 'totalIncome'],
      ],
      group: [Sequelize.fn('strftime', '%Y-%m-%d', Sequelize.col('date'))],
      raw: true,
    });

    // Fetch expense data based on timeframe
    const expenseData = await Expense.findAll({
      where: { date: dateRanges[timeFrame] },
      attributes: [
        [Sequelize.fn('strftime', '%Y-%m-%d', Sequelize.col('date')), 'date'], // Group by date
        [Sequelize.fn('sum', Sequelize.col('amount')), 'totalExpense'],
      ],
      group: [Sequelize.fn('strftime', '%Y-%m-%d', Sequelize.col('date'))],
      raw: true,
    });

    res.status(200).json({ incomeData, expenseData });
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    res.status(500).json({ error: 'Failed to fetch analysis data' });
  }
};

module.exports = { getAnalysisData };
b