const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

router.post('/advice', auth, aiController.getFinancialAdvice);
router.post('/predict', auth, aiController.predictExpenses);

module.exports = router;
