const aiService = require('../services/aiService');

// Analyze spending and give advice
exports.getFinancialAdvice = async (req, res) => {
    try {
        const { userData } = req.body;

        if (!userData) {
            return res.status(400).json({ message: 'User data is required for analysis' });
        }

        const advice = await aiService.generateFinancialAdvice(userData);
        res.status(200).json({ advice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Predict future expenses
exports.predictExpenses = async (req, res) => {
    try {
        const { history } = req.body;

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({ message: 'Transaction history array is required' });
        }

        const prediction = await aiService.predictFutureExpenses(history);
        res.status(200).json({ prediction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
