import PropTypes from 'prop-types';

const BudgetProgress = ({ spent, total, period }) => {
    const percentage = Math.min((spent / total) * 100, 100);
    const isOverBudget = percentage >= 100;
    const isWarning = percentage >= 80 && percentage < 100;

    return (
        <div className="budget-progress-component">
            <div className="progress-header">
                <span className="progress-label">{period} Budget</span>
                <span className="progress-percentage">{percentage.toFixed(0)}%</span>
            </div>

            <div className="progress-bar">
                <div
                    className={`progress-fill ${isOverBudget ? 'over-budget' : isWarning ? 'warning' : ''}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <div className="progress-footer">
                <span className="progress-spent">{spent.toFixed(2)} DT spent</span>
                <span className="progress-total">of {total.toFixed(2)} DT</span>
            </div>

            {isOverBudget && (
                <div className="progress-alert">
                    ⚠️ You've exceeded your budget!
                </div>
            )}
            {isWarning && !isOverBudget && (
                <div className="progress-warning">
                    ⚡ You're approaching your budget limit
                </div>
            )}
        </div>
    );
};

BudgetProgress.propTypes = {
    spent: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    period: PropTypes.string.isRequired
};

export default BudgetProgress;
