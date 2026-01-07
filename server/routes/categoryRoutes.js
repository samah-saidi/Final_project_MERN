const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoriesByUser,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');

router.route('/')
    .get(auth, getAllCategories)
    .post(auth, createCategory);

router.route('/user/:userId')
    .get(auth, getCategoriesByUser);

router.route('/:id')
    .put(auth, updateCategory)
    .delete(auth, deleteCategory);

module.exports = router;
