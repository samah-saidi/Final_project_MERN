import PropTypes from 'prop-types';

const BudgetCard = ({ budget, onDelete }) => {
    const calculateProgress = () => {
        const spent = budget.spent || 0;
        const percentage = (spent / budget.amount) * 100;
        return Math.min(percentage, 100);
    };

    const progress = calculateProgress();
    const isOverBudget = progress >= 100;

    return (
        <div className="budget-card">
            <div className="budget-header">
                <h3 className="budget-category">{budget.category || 'Uncategorized'}</h3>
                {onDelete && (
                    <button
                        className="btn-delete-small"
                        onClick={() => onDelete(budget._id)}
                        title="Delete budget"
                    >
                        🗑️
                    </button>
                )}
            </div>

            <div className="budget-amount">
                <span className="spent">{budget.spent || 0} DT</span>
                <span className="separator">/</span>
                <span className="total">{budget.amount} DT</span>
            </div>

            <div className="progress-bar">
                <div
                    className={`progress-fill ${isOverBudget ? 'over-budget' : ''}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="budget-info">
                <span className="budget-period">{budget.period}</span>
                <span className={`budget-status ${isOverBudget ? 'over' : 'on-track'}`}>
                    {isOverBudget ? '⚠️ Over Budget' : '✓ On Track'}
                </span>
            </div>
        </div>
    );
};

BudgetCard.propTypes = {
    budget: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        category: PropTypes.string,
        amount: PropTypes.number.isRequired,
        spent: PropTypes.number,
        period: PropTypes.string.isRequired
    }).isRequired,
    onDelete: PropTypes.func
};

export default BudgetCard;
