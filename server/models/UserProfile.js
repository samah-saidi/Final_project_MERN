const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    monthlyRevenue: {
        type: Number,
        default: 0
    },
    preferredCurrency: {
        type: String,
        default: 'USD'
    },
    alertThreshold: {
        type: Number,
        default: 80 // Percentage or amount? assuming percentage for now
    },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
    },
    avatar: {
        type: String
    },
    financialGoals: [{
        type: String
    }],
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
