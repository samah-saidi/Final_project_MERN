import PropTypes from 'prop-types';

const AccountCard = ({ account, onDelete }) => {
    const getAccountIcon = (type) => {
        switch (type) {
            case 'Checking': return '🏦';
            case 'Savings': return '💰';
            case 'Credit Card': return '💳';
            case 'Cash': return '💵';
            default: return '🏦';
        }
    };

    return (
        <div className="account-card">
            <div className="account-header">
                <div className="account-icon-wrapper">
                    <span className="account-icon">{getAccountIcon(account.type)}</span>
                </div>
                {onDelete && (
                    <button
                        className="btn-delete-small"
                        onClick={() => onDelete(account._id)}
                        title="Delete account"
                    >
                        🗑️
                    </button>
                )}
            </div>

            <h3 className="account-name">{account.name}</h3>
            <p className="account-type">{account.type}</p>

            <div className="account-balance">
                <span className="balance-amount">{account.balance?.toFixed(2) || '0.00'}</span>
                <span className="balance-currency">{account.currency || 'DT'}</span>
            </div>
        </div>
    );
};

AccountCard.propTypes = {
    account: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        balance: PropTypes.number,
        currency: PropTypes.string
    }).isRequired,
    onDelete: PropTypes.func
};

export default AccountCard;
