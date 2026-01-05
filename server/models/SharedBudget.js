const mongoose = require('mongoose');

const sharedBudgetSchema = new mongoose.Schema({
    budget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        required: true
    },
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
        contributionPercentage: { type: Number, default: 0 }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('SharedBudget', sharedBudgetSchema);
