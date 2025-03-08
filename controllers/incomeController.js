const { Income } = require('../models');  // Assuming your Income model is defined

// Create a new income
const createIncome = async (req, res) => {
  const currentDate = new Date();
  const entryDate = new Date(req.body.date);

  // Check if the date is in the future
  if (entryDate > currentDate) {
    return res.status(400).json({ error: "Date cannot be in the future." });
  }

  // Validate the necessary fields
  if (!req.body.category) {
    return res.status(400).json({ error: "All fields (title, amount, date, and category) are required." });
  }

  //console.log("Received body:", req.body);  // Debugging log

  try {
    // Destructure the necessary data from the body
    const { date, category, amount, title, message } = req.body;
    
    // Create a new income entry
    const income = await Income.create({ date, category, amount, title, message });

    // Respond with the created income
    res.status(201).json(income);
  } catch (error) {
    console.error("Error creating income:", Error); // Log error message
    res.status(500).json({ error: 'Failed to create income' });
  }
};

// Get all income entries
const getIncomes = async (req, res) => {
    try {
      // Try to fetch all incomes from the database
      const incomes = await Income.findAll(); // Assuming you're using Sequelize ORM
      /*if (incomes.length === 0) {
        return res.status(404).json({ error: 'No incomes found' });
      }*/
      res.json(incomes); // Return the fetched incomes
    } catch (error) {
      console.error("Error fetching incomes:", error.message); // Log error message
      res.status(500).json({ error: 'Failed to fetch incomes' });
    }
  };

  //add

  const updateIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, message, amount, date } = req.body; // Corrected 'description' to 'message'
  
        if (!title || !message || !amount || !date) {
            return res.status(400).json({ error: 'All fields are required for updating income' });
        }
  
        const income = await Income.findByPk(id);
        if (!income) {
            return res.status(404).json({ error: 'Income not found' });
        }
  
        await income.update({ title, message, amount, date });
  
        res.status(200).json(income);
    } catch (error) {
        console.error("Error updating income:", error);
        res.status(500).json({ error: 'Failed to update income' });
    }
  };
  
  
  const deleteIncome = async (req, res) => {
      try {
          const { id } = req.params; // Get the income ID from request params
  
          // Find the income by ID
          const income = await Income.findByPk(id);
          if (!income) {
              return res.status(404).json({ error: 'Income not found' });
          }
  
          // Delete the income
          await income.destroy();
          res.status(200).json({ message: 'Income deleted successfully' });
      } catch (error) {
          console.error("Error deleting income:", error);
          res.status(500).json({ error: 'Failed to delete income' });
      }
  };
  
  const getTotalIncomes = async (req, res) => {
      try {
          // Use Sequelize's sum function to calculate the total of the 'amount' column
          const totalIncomes = await Income.sum('amount'); // Summing up the 'amount' column from the database
          res.status(200).json({ totalIncomes }); // Sending the result back as a response
      } catch (error) {
          console.error("Error calculating total incomes:", error);
          res.status(500).json({ error: 'Failed to calculate total incomes' });
      }
  };



module.exports = { createIncome, getIncomes , updateIncome, deleteIncome, getTotalIncomes };
