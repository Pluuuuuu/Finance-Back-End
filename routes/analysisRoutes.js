const express = require('express');
const router = express.Router();
const AnalysisController = require('../controllers/AnalysisController');

// Route to get analysis data based on time frame
router.get('api/analysis/:timeFrame', AnalysisController.getAnalysisData);

module.exports = router;
