const { getModel } = require('../config/gemini');

/**
 * Service to handle financial advice and predictions using Gemini AI
 */
class AIService {
    /**
     * Generates financial advice based on user data
     * @param {Object} userData - Data containing income, expenses, categories, etc.
     * @returns {Promise<string>} - AI generated advice
     */
    async generateFinancialAdvice(userData) {
        try {
            const model = getModel();
            const prompt = `
        As a highly experienced financial advisor, analyze the following user financial data:
        ${JSON.stringify(userData)}
        
        Provide 3-5 specific, actionable, and personalized tips to help them:
        1. Reduce unnecessary spending.
        2. Optimize their savings.
        3. Better align with their financial goals.
        Keep the tone professional yet encouraging.
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Could not generate financial advice at this time.');
        }
    }

    /**
     * Predicts future expenses based on history
     * @param {Array} history - Array of previous transactions
     * @returns {Promise<string>} - AI generated prediction
     */
    async predictFutureExpenses(history) {
        try {
            const model = getModel();
            const prompt = `
        Look at this transaction history for the past few months:
        ${JSON.stringify(history)}
        
        Based on this data:
        - Identify recurring patterns.
        - Predict the total likely expenses for the upcoming month.
        - Flag any potential risks or anomalies.
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('AI Prediction Error:', error);
            throw new Error('Could not predict expenses at this time.');
        }
    }
}

module.exports = new AIService();
