const Notification = require('../models/Notification');

/**
 * Service to handle creation and management of system notifications
 */
class NotificationService {
    /**
     * Create a notification for a user
     * @param {string} userId - ID of the user
     * @param {string} message - Notification message
     * @param {string} type - Type of notification (BudgetExceeded, GoalReached, etc.)
     */
    async createNotification(userId, message, type = 'Info') {
        try {
            const notification = new Notification({
                user: userId,
                message,
                type,
                status: 'Unread'
            });
            await notification.save();
            console.log(`🔔 Notification sent to user ${userId}: ${message}`);
            return notification;
        } catch (error) {
            console.error('Notification Service Error:', error);
        }
    }

    /**
     * Mark all notifications as read for a user
     * @param {string} userId 
     */
    async markAllAsRead(userId) {
        try {
            await Notification.updateMany({ user: userId, status: 'Unread' }, { status: 'Read' });
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    }
}

module.exports = new NotificationService();
