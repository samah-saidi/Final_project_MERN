const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile'
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    savingsGoals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SavingsGoal'
    }],
    sharedBudgets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SharedBudget'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
