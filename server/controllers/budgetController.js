const Budget = require('../models/Budget');
const budgetService = require('../services/budgetService');

// Get budgets for a user
exports.getBudgetsByUser = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        const budgetStatus = await budgetService.getBudgetStatus(userId);
        res.status(200).json(budgetStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create budget (with upsert logic for convenience)
exports.createBudget = async (req, res) => {
    try {
        const { user, category, amount, amountLimit, period, isShared } = req.body;

        // Use amount if provided, otherwise use amountLimit for backwards compatibility
        const budgetAmount = amount || amountLimit;

        // Check if budget exists for this category/period
        const existingBudget = await Budget.findOne({ user, category, period });

        if (existingBudget) {
            existingBudget.amount = budgetAmount;
            existingBudget.amountLimit = budgetAmount;
            existingBudget.isShared = isShared;
            const updatedBudget = await existingBudget.save();
            return res.status(200).json(updatedBudget);
        }

        // Calculate End Date if not provided or just to be sure
        let endDate = req.body.endDate;
        if (!endDate) {
            const start = new Date(req.body.startDate || new Date());
            const end = new Date(start);
            if (period === 'Weekly') end.setDate(start.getDate() + 7);
            else if (period === 'Monthly') end.setMonth(start.getMonth() + 1);
            else if (period === 'Yearly') end.setFullYear(start.getFullYear() + 1);
            endDate = end;
        }

        const budget = new Budget({
            user: req.user.id,
            category,
            amount: budgetAmount,
            amountLimit: budgetAmount,
            period: period || 'Monthly',
            startDate: req.body.startDate || new Date(),
            endDate: endDate,
            isShared: isShared || false
        });
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
