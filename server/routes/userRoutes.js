const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    updateUserProfile,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const {
    getUserProfile,
    upsertUserProfile,
    uploadProfilePicture,
    deleteUserProfile
} = require('../controllers/userProfileController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// User routes
router.route('/')
    .get(auth, getAllUsers);

router.route('/profile')
    .put(auth, updateUserProfile);

router.route('/:id')
    .get(auth, getUserById)
    .put(auth, updateUser)
    .delete(auth, deleteUser);

// User Profile routes
router.route('/:userId/profile')
    .get(auth, getUserProfile)
    .post(auth, upsertUserProfile)
    .delete(auth, deleteUserProfile);

router.route('/:userId/profile/upload')
    .post(auth, upload.single('image'), uploadProfilePicture);

module.exports = router;
