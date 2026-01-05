const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

router.get('/user/:userId', auth, notificationController.getNotificationsByUser);
router.put('/:id/read', auth, notificationController.markAsRead);
router.post('/', auth, notificationController.createNotification);
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;
