const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Expense', 'Income', 'Both'],
        default: 'Expense'
    },
    icon: {
        type: String,
        default: '📦'
    },
    color: {
        type: String,
        default: '#667eea'
    },
    suggestedMonthlyBudget: {
        type: Number,
        default: 0
    },
    budgets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
    }],
    description: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index to ensure category names are unique per user
categorySchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
