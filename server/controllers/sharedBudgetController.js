const SharedBudget = require('../models/SharedBudget');

// Get shared budgets for a user
exports.getSharedBudgetsByUser = async (req, res) => {
    try {
        const sharedBudgets = await SharedBudget.find({ 'participants.user': req.params.userId }).populate('budget').populate('participants.user');
        res.status(200).json(sharedBudgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create shared budget
exports.createSharedBudget = async (req, res) => {
    const sharedBudget = new SharedBudget(req.body);
    try {
        const newSharedBudget = await sharedBudget.save();
        res.status(201).json(newSharedBudget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add participant
exports.addParticipant = async (req, res) => {
    try {
        const sharedBudget = await SharedBudget.findById(req.params.id);
        if (!sharedBudget) return res.status(404).json({ message: 'Shared budget not found' });

        sharedBudget.participants.push(req.body);
        const updatedSharedBudget = await sharedBudget.save();
        res.status(200).json(updatedSharedBudget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete shared budget
exports.deleteSharedBudget = async (req, res) => {
    try {
        const sharedBudget = await SharedBudget.findByIdAndDelete(req.params.id);
        if (!sharedBudget) return res.status(404).json({ message: 'Shared budget not found' });
        res.status(200).json({ message: 'Shared budget deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
