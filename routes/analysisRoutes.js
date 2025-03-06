// routes/analysis.js
const express = require('express');
const router = express.Router();
const AnalysisController = require('../controllers/AnalysisController');

// Route to get analysis data based on time frame
router.get('/analysis/:timeFrame', AnalysisController.getAnalysisData);

module.exports = router;
