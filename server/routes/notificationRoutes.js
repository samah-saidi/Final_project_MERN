const express = require('express');
const router = express.Router();
const {
    getNotificationsByUser,
    markAsRead,
    createNotification,
    deleteNotification
} = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

router.route('/')
    .post(auth, createNotification);

router.route('/user/:userId')
    .get(auth, getNotificationsByUser);

router.route('/:id')
    .delete(auth, deleteNotification);

router.route('/:id/read')
    .put(auth, markAsRead);

module.exports = router;
