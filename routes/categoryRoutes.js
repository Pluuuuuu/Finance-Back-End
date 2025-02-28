const express = require('express');
const router = express.Router();
const { createCategory, getCategories } = require('../controllers/CategoryController');

// Route for adding a new category
router.post('/', createCategory);

// Route for fetching all categories
router.get('/', getCategories);

module.exports = router;
