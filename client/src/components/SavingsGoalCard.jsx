import PropTypes from 'prop-types';

const SavingsGoalCard = ({ goal, onDelete }) => {
    const calculateProgress = () => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        return Math.min(progress, 100);
    };

    const getDaysRemaining = () => {
        if (!goal.deadline) return null;
        const today = new Date();
        const deadlineDate = new Date(goal.deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const progress = calculateProgress();
    const isCompleted = progress >= 100;
    const daysRemaining = getDaysRemaining();

    return (
        <div className={`goal-card ${isCompleted ? 'completed' : ''}`}>
            <div className="goal-header">
                <h3 className="goal-name">{goal.name}</h3>
                {onDelete && (
                    <button
                        className="btn-delete-small"
                        onClick={() => onDelete(goal._id)}
                        title="Delete goal"
                    >
                        🗑️
                    </button>
                )}
            </div>

            {goal.description && (
                <p className="goal-description">{goal.description}</p>
            )}

            <div className="goal-amount">
                <span className="current">{goal.currentAmount?.toFixed(2) || '0.00'} DT</span>
                <span className="separator">/</span>
                <span className="target">{goal.targetAmount?.toFixed(2)} DT</span>
            </div>

            <div className="progress-bar">
                <div
                    className={`progress-fill ${isCompleted ? 'completed' : ''}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="goal-footer">
                <span className="progress-text">{progress.toFixed(0)}% Complete</span>
                {daysRemaining !== null && (
                    <span className={`days-remaining ${daysRemaining < 0 ? 'overdue' : ''}`}>
                        {daysRemaining < 0
                            ? `${Math.abs(daysRemaining)} days overdue`
                            : `${daysRemaining} days left`}
                    </span>
                )}
            </div>

            {isCompleted && (
                <div className="goal-badge">🎉 Goal Achieved!</div>
            )}
        </div>
    );
};

SavingsGoalCard.propTypes = {
    goal: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        targetAmount: PropTypes.number.isRequired,
        currentAmount: PropTypes.number,
        deadline: PropTypes.string
    }).isRequired,
    onDelete: PropTypes.func
};

export default SavingsGoalCard;
