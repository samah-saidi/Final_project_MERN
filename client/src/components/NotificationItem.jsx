import PropTypes from 'prop-types';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'budget_alert': return '⚠️';
            case 'goal_achieved': return '🎯';
            case 'payment_reminder': return '💳';
            case 'system': return '🔔';
            default: return '📢';
        }
    };

    return (
        <div
            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
            onClick={() => !notification.isRead && onMarkAsRead && onMarkAsRead(notification._id)}
        >
            <div className="notification-icon">
                {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
                <h3 className="notification-title">{notification.title || 'Notification'}</h3>
                <p className="notification-message">{notification.message}</p>
                <p className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                </p>
            </div>
            <div className="notification-actions">
                {!notification.isRead && (
                    <span className="unread-dot" title="Unread"></span>
                )}
                {onDelete && (
                    <button
                        className="btn-delete-small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(notification._id);
                        }}
                        title="Delete notification"
                    >
                        🗑️
                    </button>
                )}
            </div>
        </div>
    );
};

NotificationItem.propTypes = {
    notification: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        type: PropTypes.string,
        title: PropTypes.string,
        message: PropTypes.string.isRequired,
        isRead: PropTypes.bool,
        createdAt: PropTypes.string.isRequired
    }).isRequired,
    onMarkAsRead: PropTypes.func,
    onDelete: PropTypes.func
};

export default NotificationItem;
