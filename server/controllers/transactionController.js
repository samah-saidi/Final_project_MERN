const Transaction = require('../models/Transaction');
const budgetService = require('../services/budgetService');

// Get all transactions for a user
exports.getTransactionsByUser = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.params.userId }).populate('category').populate('account');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create transaction
exports.createTransaction = async (req, res) => {
    const transaction = new Transaction(req.body);
    try {
        const newTransaction = await transaction.save();

        // If it's an expense, check the budget in background
        if (newTransaction.type === 'Expense') {
            budgetService.checkBudgetOverflow(newTransaction.user, newTransaction.category);
        }

        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
