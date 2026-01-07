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
    currency: {
        type: String,
        default: 'DT'
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    occupation: {
        type: String
    },
    alertThreshold: {
        type: Number,
        default: 80
    },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
    },
    avatar: {
        type: String
    },
    profilePicture: {
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
