const { Category } = require('../models');

const createCategory = async (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
    }
    try {
        const category = await Category.create({ name, type });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

module.exports = { createCategory, getCategories };
