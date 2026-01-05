const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const sharedBudgetController = require('../controllers/sharedBudgetController');
const auth = require('../middleware/authMiddleware');

// Personal Budgets
router.get('/user/:userId', auth, budgetController.getBudgetsByUser);
router.post('/', auth, budgetController.createBudget);
router.put('/:id', auth, budgetController.updateBudget);
router.delete('/:id', auth, budgetController.deleteBudget);

// Shared Budgets
router.get('/shared/user/:userId', auth, sharedBudgetController.getSharedBudgetsByUser);
router.post('/shared', auth, sharedBudgetController.createSharedBudget);
router.put('/shared/:id/participant', auth, sharedBudgetController.addParticipant);
router.delete('/shared/:id', auth, sharedBudgetController.deleteSharedBudget);

module.exports = router;
