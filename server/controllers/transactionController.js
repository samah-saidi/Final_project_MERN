const Transaction = require('../models/Transaction');
const budgetService = require('../services/budgetService');
const notificationService = require('../services/notificationService');
const Category = require('../models/Category');
const Account = require('../models/Account');

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

        // Update Account Balance
        if (newTransaction.account) {
            const account = await Account.findById(newTransaction.account);
            if (account) {
                if (newTransaction.type === 'Income') {
                    account.balance += newTransaction.amount;
                } else {
                    account.balance -= newTransaction.amount;
                }
                await account.save();
            }
        }

        // Send notification for new transaction
        const category = await Category.findById(newTransaction.category);
        const categoryName = category ? category.name : 'Uncategorized';
        const message = `New ${newTransaction.type} added: ${newTransaction.amount} DT in "${categoryName}"`;
        await notificationService.createNotification(newTransaction.user, message, 'Info');

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
        const oldTransaction = await Transaction.findById(req.params.id);
        if (!oldTransaction) return res.status(404).json({ message: 'Transaction not found' });

        // Revert old transaction effect on account
        if (oldTransaction.account) {
            const oldAccount = await Account.findById(oldTransaction.account);
            if (oldAccount) {
                if (oldTransaction.type === 'Income') {
                    oldAccount.balance -= oldTransaction.amount;
                } else {
                    oldAccount.balance += oldTransaction.amount;
                }
                await oldAccount.save();
            }
        }

        // Update transaction
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Apply new transaction effect on account
        if (updatedTransaction.account) {
            const newAccount = await Account.findById(updatedTransaction.account);
            if (newAccount) {
                if (updatedTransaction.type === 'Income') {
                    newAccount.balance += updatedTransaction.amount;
                } else {
                    newAccount.balance -= updatedTransaction.amount;
                }
                await newAccount.save();
            }
        }

        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        // Update Account Balance (Revert)
        if (transaction.account) {
            const account = await Account.findById(transaction.account);
            if (account) {
                if (transaction.type === 'Income') {
                    account.balance -= transaction.amount;
                } else {
                    account.balance += transaction.amount;
                }
                await account.save();
            }
        }

        await Transaction.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
