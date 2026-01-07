const express = require('express');
const router = express.Router();
const {
    getSavingsGoalsByUser,
    createSavingsGoal,
    updateSavingsGoal,
    getGoalContributions,
    addContribution,
    deleteSavingsGoal
} = require('../controllers/savingsGoalController');
const auth = require('../middleware/authMiddleware');

router.route('/')
    .post(auth, createSavingsGoal);

router.route('/user/:userId')
    .get(auth, getSavingsGoalsByUser);

router.route('/:id')
    .put(auth, updateSavingsGoal)
    .delete(auth, deleteSavingsGoal);

router.route('/:id/contributions')
    .get(auth, getGoalContributions);

router.route('/:id/contribute')
    .post(auth, addContribution);

module.exports = router;
