const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    totalLimit: {
        type: Number,
        required: true
    },
    categories: [{
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        limit: { type: Number }
    }],
    isShared: {
        type: Boolean,
        default: false
    },
    sharedBudget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SharedBudget'
    },
    alerts: [{
        threshold: { type: Number }, // percentage, e.g., 80
        triggered: { type: Boolean, default: false },
        dateTriggered: { type: Date }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);
