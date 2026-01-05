const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userProfileController = require('../controllers/userProfileController');
const auth = require('../middleware/authMiddleware');

// User routes
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

// User Profile routes
router.get('/:userId/profile', auth, userProfileController.getUserProfile);
router.post('/:userId/profile', auth, userProfileController.upsertUserProfile);
router.delete('/:userId/profile', auth, userProfileController.deleteUserProfile);

module.exports = router;
