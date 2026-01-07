const express = require('express');
const router = express.Router();
const {
    getBudgetsByUser,
    createBudget,
    updateBudget,
    deleteBudget
} = require('../controllers/budgetController');
const {
    getSharedBudgetsByUser,
    createSharedBudget,
    addParticipant,
    deleteSharedBudget
} = require('../controllers/sharedBudgetController');
const auth = require('../middleware/authMiddleware');

// Personal Budgets
router.route('/')
    .post(auth, createBudget);

router.route('/user/:userId')
    .get(auth, getBudgetsByUser);

router.route('/:id')
    .put(auth, updateBudget)
    .delete(auth, deleteBudget);

// Shared Budgets
router.route('/shared')
    .post(auth, createSharedBudget);

router.route('/shared/user/:userId')
    .get(auth, getSharedBudgetsByUser);

router.route('/shared/:id')
    .delete(auth, deleteSharedBudget);

router.route('/shared/:id/participant')
    .put(auth, addParticipant);

module.exports = router;
