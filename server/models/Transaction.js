const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['Income', 'Expense'],
        required: true
    },
    description: {
        type: String
    },
    notes: {
        type: String
    },
    tags: {
        isRecurring: { type: Boolean, default: false },
        isImportant: { type: Boolean, default: false },
        isRefundable: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
