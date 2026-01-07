const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    analyzeSpending,
    generateBudgetStrategy,
    suggestSimilarStrategies,
    generateFinancialBio,
    getMarketInsights,
    assistantChat,
    generateFinanceQuiz,
    getPersonalizedAdvice
} = require('../controllers/aiController');

// Routes protégées (Finance Context)
router.post('/analyze-spending/:period', auth, analyzeSpending);
router.post('/budget-strategy', auth, generateBudgetStrategy);
router.post('/financial-bio', auth, generateFinancialBio);
router.get('/market-insights', auth, getMarketInsights);
router.post('/finance-quiz/:topic', auth, generateFinanceQuiz);
router.get('/personalized-advice/:userId', auth, getPersonalizedAdvice);

// Routes publiques / Services Généraux
router.post('/similar-strategies/:strategyId', suggestSimilarStrategies);
router.post('/financial-assistant', assistantChat);

module.exports = router;
