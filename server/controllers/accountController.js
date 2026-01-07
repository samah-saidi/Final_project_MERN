const Account = require('../models/Account');

// Get all accounts for a user
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.user.id });
        res.json(accounts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Create a new account
exports.createAccount = async (req, res) => {
    try {
        const newAccount = new Account({
            name: req.body.name,
            type: req.body.type,
            balance: req.body.balance,
            currency: req.body.currency,
            user: req.user.id
        });
        const account = await newAccount.save();
        res.json(account);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Update an account
exports.updateAccount = async (req, res) => {
    try {
        let account = await Account.findById(req.params.id);
        if (!account) return res.status(404).json({ message: 'Account not found' });

        // Check ownership
        if (account.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        account = await Account.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(account);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Delete an account
exports.deleteAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) return res.status(404).json({ message: 'Account not found' });

        // Check ownership
        if (account.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Account.findByIdAndDelete(req.params.id);
        res.json({ message: 'Account removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
