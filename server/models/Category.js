const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String
    },
    color: {
        type: String
    },
    suggestedMonthlyBudget: {
        type: Number,
        default: 0
    },
    budgets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
