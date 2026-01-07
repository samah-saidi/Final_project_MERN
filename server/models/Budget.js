const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    amountLimit: {
        type: Number,
        required: false
    },
    spent: {
        type: Number,
        default: 0
    },
    currentSpending: {
        type: Number,
        default: 0
    },
    period: {
        type: String,
        enum: ['Weekly', 'Monthly', 'Yearly'],
        default: 'Monthly'
    },
    isShared: {
        type: Boolean,
        default: false
    },
    alerts: [{
        threshold: { type: Number }, // e.g., 80 for 80%
        triggered: { type: Boolean, default: false },
        dateTriggered: { type: Date }
    }],
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

budgetSchema.index({ user: 1, category: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
