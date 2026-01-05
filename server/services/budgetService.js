const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const notificationService = require('./notificationService');

/**
 * Service to manage budget logic and threshold checks
 */
class BudgetService {
    /**
     * Check if a user has exceeded their budget for a specific category
     * @param {string} userId 
     * @param {string} categoryId 
     */
    async checkBudgetOverflow(userId, categoryId) {
        try {
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            // Find active budget for user
            const budget = await Budget.findOne({ user: userId, month, year });
            if (!budget) return;

            // Find the specific category in the budget
            const categoryBudget = budget.categories.find(c => c.category.toString() === categoryId.toString());
            if (!categoryBudget) return;

            // Calculate total spending for this category in the current month
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0);

            const transactions = await Transaction.find({
                user: userId,
                category: categoryId,
                type: 'Expense',
                date: { $gte: startOfMonth, $lte: endOfMonth }
            });

            const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

            // Check if limit is reached
            if (totalSpent >= categoryBudget.limit) {
                await notificationService.createNotification(
                    userId,
                    `Attention ! Vous avez dépassé votre budget pour cette catégorie (${totalSpent} / ${categoryBudget.limit}).`,
                    'BudgetExceeded'
                );
            } else if (totalSpent >= categoryBudget.limit * 0.8) {
                // Warning at 80%
                await notificationService.createNotification(
                    userId,
                    `Alerte : Vous avez atteint 80% de votre budget pour cette catégorie.`,
                    'BudgetExceeded'
                );
            }
        } catch (error) {
            console.error('Budget Service Error:', error);
        }
    }
}

module.exports = new BudgetService();
