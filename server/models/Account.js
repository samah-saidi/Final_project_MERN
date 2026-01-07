const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Checking', 'Savings', 'Credit Card', 'Cash', 'Investment'],
        default: 'Checking'
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'DT'
    },
    icon: {
        type: String,
        default: '🏦'
    },
    color: {
        type: String,
        default: '#667eea'
    }
}, {
    timestamps: true
});

// Index for performance
accountSchema.index({ user: 1 });

module.exports = mongoose.model('Account', accountSchema);
