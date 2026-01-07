import PropTypes from 'prop-types';

const TransactionItem = ({ transaction, onDelete }) => {
  const getTransactionIcon = (type) => {
    return type === 'Income' ? '💰' : '💸';
  };

  return (
    <div className="transaction-item">
      <div className="transaction-icon">
        {getTransactionIcon(transaction.type)}
      </div>
      <div className="transaction-details">
        <h3 className="transaction-category">{transaction.category || 'Uncategorized'}</h3>
        {transaction.description && (
          <p className="transaction-description">{transaction.description}</p>
        )}
        <p className="transaction-date">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
      <div className="transaction-amount-section">
        <span className={`transaction-amount ${transaction.type.toLowerCase()}`}>
          {transaction.type === 'Income' ? '+' : '-'}{transaction.amount} DT
        </span>
        {onDelete && (
          <button
            className="btn-delete-small"
            onClick={() => onDelete(transaction._id)}
            title="Delete transaction"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    category: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired
  }).isRequired,
  onDelete: PropTypes.func
};

export default TransactionItem;
