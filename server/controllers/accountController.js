const Account = require('../models/Account');

// Get all accounts for a user
exports.getAccountsByUser = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.params.userId });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create account
exports.createAccount = async (req, res) => {
    const account = new Account(req.body);
    try {
        const newAccount = await account.save();
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update account
exports.updateAccount = async (req, res) => {
    try {
        const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!account) return res.status(404).json({ message: 'Account not found' });
        res.status(200).json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        const account = await Account.findByIdAndDelete(req.params.id);
        if (!account) return res.status(404).json({ message: 'Account not found' });
        res.status(200).json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
