const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const notificationService = require('./notificationService');
const Category = require('../models/Category');

/**
 * Check if a user has exceeded their budget for a specific category
 * This runs in the background after a transaction is created
 */
exports.checkBudgetOverflow = async (userId, categoryId) => {
    try {
        // Find the budget for this user and category
        const budget = await Budget.findOne({
            user: userId,
            category: categoryId
        });

        if (!budget) {
            // No budget set for this category, nothing to check
            return;
        }

        // Calculate total expenses for this category in the current period
        const startDate = new Date(budget.startDate);
        const endDate = new Date(budget.endDate);

        const totalExpenses = await Transaction.aggregate([
            {
                $match: {
                    user: userId,
                    category: categoryId,
                    type: 'Expense',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const spent = totalExpenses.length > 0 ? totalExpenses[0].total : 0;

        // Check if budget is exceeded
        if (spent > budget.amount) {
            const category = await Category.findById(categoryId);
            const categoryName = category ? category.name : 'Unknown';
            const message = `⚠️ Budget exceeded for "${categoryName}"! Spent: ${spent} DT, Limit: ${budget.amount} DT`;
            await notificationService.createNotification(userId, message, 'BudgetExceeded');
        }

        return {
            budgetAmount: budget.amount,
            spent,
            remaining: budget.amount - spent,
            isOverBudget: spent > budget.amount
        };
    } catch (error) {
        console.error('Error checking budget overflow:', error);
    }
};

/**
 * Get budget status for a user
 */
exports.getBudgetStatus = async (userId) => {
    try {
        const budgets = await Budget.find({ user: userId })
            .populate('category');

        const budgetStatus = await Promise.all(
            budgets.map(async (budget) => {
                const startDate = budget.startDate ? new Date(budget.startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                const endDate = budget.endDate ? new Date(budget.endDate) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

                const totalExpenses = await Transaction.aggregate([
                    {
                        $match: {
                            user: userId,
                            category: budget.category._id,
                            type: 'Expense',
                            date: { $gte: startDate, $lte: endDate }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' }
                        }
                    }
                ]);

                const spent = totalExpenses.length > 0 ? totalExpenses[0].total : 0;

                return {
                    _id: budget._id,
                    category: budget.category,
                    budgetAmount: budget.amount,
                    amount: budget.amount, // for backward compatibility in frontend
                    spent,
                    remaining: budget.amount - spent,
                    percentage: (spent / budget.amount) * 100,
                    isOverBudget: spent > budget.amount,
                    period: budget.period, // include the period string
                    periodDates: {
                        start: budget.startDate,
                        end: budget.endDate
                    },
                    startDate: budget.startDate,
                    endDate: budget.endDate
                };
            })
        );

        return budgetStatus;
    } catch (error) {
        console.error('Error getting budget status:', error);
        throw error;
    }
};
