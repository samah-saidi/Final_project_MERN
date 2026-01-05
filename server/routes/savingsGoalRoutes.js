const express = require('express');
const router = express.Router();
const savingsGoalController = require('../controllers/savingsGoalController');
const auth = require('../middleware/authMiddleware');

router.get('/user/:userId', auth, savingsGoalController.getSavingsGoalsByUser);
router.post('/', auth, savingsGoalController.createSavingsGoal);
router.put('/:id/contribute', auth, savingsGoalController.addContribution);
router.delete('/:id', auth, savingsGoalController.deleteSavingsGoal);

module.exports = router;
