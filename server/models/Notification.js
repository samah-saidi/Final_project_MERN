const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['BudgetExceeded', 'GoalReached', 'AnomalyDetected', 'Info'],
        default: 'Info'
    },
    status: {
        type: String,
        enum: ['Read', 'Unread'],
        default: 'Unread'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
