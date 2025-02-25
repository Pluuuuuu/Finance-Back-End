const express = require("express");
const app = express();


// Import routes
const expenseRoutes = require("./routes/expenseRoutes"); // ✅ Ensure this points to the correct file

// Middleware
app.use(express.json());

// Use routes
app.use("/api/expenses", expenseRoutes); // ✅ Use the correct variable

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = router;