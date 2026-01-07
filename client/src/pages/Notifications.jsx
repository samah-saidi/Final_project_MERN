import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, read

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get(`/notifications/user/${user._id || user.id}`);
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(notif =>
                notif._id === id ? { ...notif, status: 'Read' } : notif
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await Promise.all(
                notifications
                    .filter(n => n.status === 'Unread')
                    .map(n => api.put(`/notifications/${n._id}/read`))
            );
            setNotifications(notifications.map(notif => ({ ...notif, status: 'Read' })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getFilteredNotifications = () => {
        switch (filter) {
            case 'unread':
                return notifications.filter(n => n.status === 'Unread');
            case 'read':
                return notifications.filter(n => n.status === 'Read');
            default:
                return notifications;
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'BudgetExceeded':
                return '⚠️';
            case 'GoalReached':
                return '🎯';
            case 'AnomalyDetected':
                return '�';
            case 'Info':
                return 'ℹ️';
            default:
                return '�';
        }
    };

    const filteredNotifications = getFilteredNotifications();
    const unreadCount = notifications.filter(n => n.status === 'Unread').length;

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading notifications...</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Notifications</h1>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount} unread</span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        className="btn btn-secondary"
                        onClick={markAllAsRead}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notification-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({notifications.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilter('unread')}
                >
                    Unread ({unreadCount})
                </button>
                <button
                    className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
                    onClick={() => setFilter('read')}
                >
                    Read ({notifications.length - unreadCount})
                </button>
            </div>

            <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">🔔</p>
                        <p className="empty-text">
                            {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
                        </p>
                        <p className="empty-subtext">
                            {filter === 'all'
                                ? "You're all caught up!"
                                : `You have no ${filter} notifications at the moment`}
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-item ${notification.status === 'Unread' ? 'unread' : ''}`}
                            onClick={() => notification.status === 'Unread' && markAsRead(notification._id)}
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
                            <div class="notification-actions">
                                {notification.status === 'Unread' && (
                                    <span class="unread-dot" title="Unread"></span>
                                )}
                                <button
                                    className="btn-delete-small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification._id);
                                    }}
                                    title="Delete notification"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
