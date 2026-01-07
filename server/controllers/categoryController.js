const Category = require('../models/Category');

// Get all categories for the authenticated user
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get categories by a specific user ID (requested by frontend)
exports.getCategoriesByUser = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.params.userId });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create category
exports.createCategory = async (req, res) => {
    try {
        const categoryData = {
            ...req.body,
            user: req.user ? req.user.id : req.body.user // Handle both authenticated and direct ID
        };
        const category = new Category(categoryData);
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
