const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Checking', 'Savings', 'Investment', 'Crypto'],
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    bankName: {
        type: String
    },
    currency: {
        type: String,
        default: 'USD'
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
