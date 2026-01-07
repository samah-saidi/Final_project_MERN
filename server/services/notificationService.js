const Notification = require('../models/Notification');

/**
 * Create a new notification for a user
 * @param {string} userId - ID of the user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (BudgetExceeded, GoalReached, AnomalyDetected, Info)
 */
exports.createNotification = async (userId, message, type = 'Info') => {
    try {
        const notification = new Notification({
            user: userId,
            message,
            type,
            status: 'Unread',
            date: new Date()
        });

        await notification.save();
        console.log(`🔔 Notification created for user ${userId}: ${message}`);
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};
