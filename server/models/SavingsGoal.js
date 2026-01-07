const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
