import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Swal from 'sweetalert2';

const Transactions = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        type: 'Expense',
        amount: '',
        category: '',
        account: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchTransactions(), fetchCategories(), fetchAccounts()]);
        setLoading(false);
    };

    const fetchAccounts = async () => {
        try {
            const response = await api.get('/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get(`/categories/user/${user._id || user.id}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await api.get(`/transactions/user/${user._id || user.id}`);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const transactionData = {
                ...formData,
                user: user._id || user.id,
                amount: parseFloat(formData.amount)
            };

            if (editingId) {
                await api.put(`/transactions/${editingId}`, transactionData);
                Swal.fire({
                    icon: 'success',
                    title: 'Transaction Updated!',
                    text: 'Your transaction has been modified successfully',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await api.post('/transactions', transactionData);
                Swal.fire({
                    icon: 'success',
                    title: 'Transaction Added!',
                    text: 'Your transaction has been recorded',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            setFormData({
                type: 'Expense',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                description: '',
                account: ''
            });
            setShowAddForm(false);
            setEditingId(null);
            fetchData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || `Failed to ${editingId ? 'update' : 'add'} transaction`,
                background: '#1a1a2e',
                color: '#fff'
            });
        }
    };

    const handleEdit = (transaction) => {
        setFormData({
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category?._id || transaction.category,
            date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
            description: transaction.description || '',
            account: transaction.account?._id || transaction.account || ''
        });
        setEditingId(transaction._id);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            background: '#1a1a2e',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/transactions/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Transaction has been deleted.',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchTransactions();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete transaction',
                    background: '#1a1a2e',
                    color: '#fff'
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading transactions...</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Transactions</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        if (showAddForm) setEditingId(null);
                        if (!showAddForm) {
                            setFormData({
                                type: 'Expense',
                                amount: '',
                                category: '',
                                date: new Date().toISOString().split('T')[0],
                                description: '',
                                account: ''
                            });
                        }
                    }}
                >
                    {showAddForm ? 'Cancel' : '+ Add Transaction'}
                </button>
            </div>

            {showAddForm && (
                <div className="card form-card">
                    <h2 className="card-title">{editingId ? 'Edit Transaction' : 'New Transaction'}</h2>
                    <form onSubmit={handleSubmit} className="transaction-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="account" className="form-label">Account</label>
                                <select
                                    id="account"
                                    name="account"
                                    value={formData.account}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select Account</option>
                                    {accounts.map(acc => (
                                        <option key={acc._id} value={acc._id}>
                                            {acc.name} ({acc.balance} DT)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="type" className="form-label">Type</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="Expense">Expense</option>
                                    <option value="Income">Income</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="amount" className="form-label">Amount (DT)</label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date" className="form-label">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Add a note about this transaction"
                                rows="3"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            {editingId ? 'Update Transaction' : 'Add Transaction'}
                        </button>
                    </form>
                </div>
            )}

            <div className="transactions-list">
                {transactions.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">💰</p>
                        <p className="empty-text">No transactions yet</p>
                        <p className="empty-subtext">Start tracking your finances by adding your first transaction</p>
                    </div>
                ) : (
                    transactions.map((transaction) => {
                        const categoryName = transaction.category?.name || 'Uncategorized';
                        const categoryIcon = transaction.category?.icon || (transaction.type === 'Income' ? '💵' : '💸');

                        return (
                            <div key={transaction._id} className="transaction-item">
                                <div className="transaction-icon">
                                    {categoryIcon}
                                </div>
                                <div className="transaction-details">
                                    <h3 className="transaction-category">{categoryName}</h3>
                                    <p className="transaction-description">{transaction.description || 'No description'}</p>
                                    <p className="transaction-date">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="transaction-amount-section">
                                    <p className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                                        {transaction.type === 'Income' ? '+' : '-'}
                                        {transaction.amount} DT
                                    </p>
                                    <div className="goal-actions">
                                        <button
                                            className="btn-edit-small"
                                            onClick={() => handleEdit(transaction)}
                                            title="Edit transaction"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-delete-small"
                                            onClick={() => handleDelete(transaction._id)}
                                            title="Delete transaction"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Transactions;
