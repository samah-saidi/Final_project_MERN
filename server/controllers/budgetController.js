const Budget = require('../models/Budget');

// Get budgets for a user
exports.getBudgetsByUser = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.params.userId }).populate('categories.category');
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create budget
exports.createBudget = async (req, res) => {
    const budget = new Budget(req.body);
    try {
        const newBudget = await budget.save();
        res.status(201).json(newBudget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update budget
exports.updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findByIdAndDelete(req.params.id);
        if (!budget) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json({ message: 'Budget deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
