const SavingsGoal = require('../models/SavingsGoal');

// Get savings goals for a user
exports.getSavingsGoalsByUser = async (req, res) => {
    try {
        const goals = await SavingsGoal.find({ user: req.params.userId || req.user.id });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create savings goal
exports.createSavingsGoal = async (req, res) => {
    try {
        const goalData = {
            ...req.body,
            user: req.user.id
        };
        const goal = new SavingsGoal(goalData);
        const newGoal = await goal.save();
        res.status(201).json(newGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add contribution to goal (Simplified - no separate model)
exports.addContribution = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const goal = await SavingsGoal.findById(id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        // Update current amount in the goal
        goal.currentAmount += Number(amount);
        const updatedGoal = await goal.save();

        res.status(200).json({ goal: updatedGoal });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get contributions (Removed - no separate model)
exports.getGoalContributions = async (req, res) => {
    res.status(200).json([]);
};

// Update savings goal
exports.updateSavingsGoal = async (req, res) => {
    try {
        const goal = await SavingsGoal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        // Check ownership
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedGoal = await SavingsGoal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete savings goal and its contributions
exports.deleteSavingsGoal = async (req, res) => {
    try {
        const goal = await SavingsGoal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        // Check ownership
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete the goal
        await SavingsGoal.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
