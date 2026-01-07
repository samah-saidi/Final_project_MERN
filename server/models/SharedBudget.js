const mongoose = require('mongoose');

const sharedBudgetSchema = new mongoose.Schema({
    budget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sharedWith: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        permissions: {
            type: String,
            enum: ['View', 'Edit'],
            default: 'View'
        }
    }],
    inviteToken: {
        type: String
    }
}, {
    timestamps: true
});

// Index for lookup
sharedBudgetSchema.index({ budget: 1 });
sharedBudgetSchema.index({ 'sharedWith.user': 1 });

module.exports = mongoose.model('SharedBudget', sharedBudgetSchema);
