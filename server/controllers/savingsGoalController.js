const SavingsGoal = require('../models/SavingsGoal');

// Get savings goals for a user
exports.getSavingsGoalsByUser = async (req, res) => {
    try {
        const goals = await SavingsGoal.find({ user: req.params.userId });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create savings goal
exports.createSavingsGoal = async (req, res) => {
    const goal = new SavingsGoal(req.body);
    try {
        const newGoal = await goal.save();
        res.status(201).json(newGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add contribution to goal
exports.addContribution = async (req, res) => {
    try {
        const goal = await SavingsGoal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        const { amount } = req.body;
        goal.contributions.push({ amount });
        goal.currentAmount += Number(amount);

        const updatedGoal = await goal.save();
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete savings goal
exports.deleteSavingsGoal = async (req, res) => {
    try {
        const goal = await SavingsGoal.findByIdAndDelete(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.status(200).json({ message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
