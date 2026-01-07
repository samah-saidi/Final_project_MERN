const { getModel } = require('../config/gemini.js');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const budgetService = require('../services/budgetService');

/**
 * @desc    Analyze spending patterns for a specific period
 */
exports.analyzeSpending = async (req, res) => {
    try {
        const { period } = req.params;
        const userId = req.user.id;

        // Fetch transactions for that period (simplified logic)
        const transactions = await Transaction.find({ user: userId }).limit(30);

        const model = getModel();
        const prompt = `Analyse les habitudes de dépenses pour l'utilisateur sur la période : ${period}. 
        Données : ${JSON.stringify(transactions)}. 
        Donne un rapport détaillé en français avec des conseils d'économie.`;

        const result = await model.generateContent(prompt);
        res.json({ analysis: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur AI: analyzeSpending' });
    }
};

/**
 * @desc    Generate a strategy for a specific budget
 */
exports.generateBudgetStrategy = async (req, res) => {
    try {
        const { category, amount } = req.body;
        const model = getModel();
        const prompt = `Génère une stratégie de gestion pour un budget de ${amount} DT dans la catégorie "${category}". 
        Donne des astuces concrètes pour ne pas dépasser cette limite.`;

        const result = await model.generateContent(prompt);
        res.json({ strategy: result.response.text() });
    } catch (error) {
        res.status(500).json({ message: 'Erreur AI: generateBudgetStrategy' });
    }
};

/**
 * @desc    Generate a financial persona bio
 */
exports.generateFinancialBio = async (req, res) => {
    try {
        const { accounts, goals } = req.body;
        const model = getModel();
        const prompt = `En te basant sur ces comptes (${JSON.stringify(accounts)}) et ces objectifs (${JSON.stringify(goals)}), 
        crée une biographie de profil financier motivante et professionnelle.`;

        const result = await model.generateContent(prompt);
        res.json({ bio: result.response.text() });
    } catch (error) {
        res.status(500).json({ message: 'Erreur AI: generateFinancialBio' });
    }
};

/**
 * @desc    Get macro-financial platform insights
 */
exports.getMarketInsights = async (req, res) => {
    try {
        const model = getModel();
        const prompt = `Donne 3 tendances financières majeures en Tunisie ou dans le monde pour cette semaine, utiles pour gérer son argent.`;

        const result = await model.generateContent(prompt);
        res.json({ insights: result.response.text() });
    } catch (error) {
        res.status(500).json({ message: 'Erreur AI: getMarketInsights' });
    }
};

/**
 * @desc    Generate a financial literacy quiz
 */
exports.generateFinanceQuiz = async (req, res) => {
    try {
        const { topic } = req.params;
        const model = getModel();
        const prompt = `Génère un quiz de 5 questions sur le thème financier : ${topic}. 
        Format JSON strict: [{"question": "...", "options": ["...", "..."], "answer": 0}].`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        res.json(JSON.parse(text));
    } catch (error) {
        res.status(500).json({ message: 'Erreur AI: generateFinanceQuiz' });
    }
};

/**
 * @desc    Get deeply personalized financial advice
 */
exports.getPersonalizedAdvice = async (req, res) => {
    try {
        const { userId } = req.params;
        const budgetStatus = await budgetService.getBudgetStatus(userId);

        const model = getModel();
        const prompt = `Voici l'état des budgets de l'utilisateur : ${JSON.stringify(budgetStatus)}. 
        Donne des conseils ultra-personnalisés pour optimiser ses finances ce mois-ci.`;

        const result = await model.generateContent(prompt);
        res.json({ advice: result.response.text() });
    } catch (error) {
        res.status(500).json({ message: 'Erreur AI: getPersonalizedAdvice' });
    }
};

/**
 * @desc    Suggest similar savings goals or investment strategies
 */
exports.suggestSimilarStrategies = async (req, res) => {
    try {
        const { strategyId } = req.params;
        const model = getModel();
        const prompt = `L'utilisateur s'intéresse à la stratégie financière "${strategyId}". Suggère 3 alternatives ou compléments intelligents.`;

        const result = await model.generateContent(prompt);
        res.json({ suggestions: result.response.text() });
    } catch (error) {
        res.status(500).json({ message: 'Erreur AI: suggestSimilarStrategies' });
    }
};

/**
 * @desc    Interactive Financial Assistant (Chatbot)
 */
exports.assistantChat = async (req, res) => {
    try {
        const { message, history } = req.body;
        const model = getModel();
        const prompt = `Tu es l'assistant intelligent SmartWallet AI. Expert en finance. Historique: ${JSON.stringify(history)}. 
        Réponds à : ${message}`;

        const result = await model.generateContent(prompt);
        res.json({ reply: result.response.text() });
    } catch (error) {
        res.status(500).json({ message: 'Erreur AI: assistantChat' });
    }
};
