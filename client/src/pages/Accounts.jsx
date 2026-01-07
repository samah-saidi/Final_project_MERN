import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Swal from 'sweetalert2';

const Accounts = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Checking',
        balance: '',
        currency: 'DT'
    });

    useEffect(() => {
        if (user) {
            fetchAccounts();
        }
    }, [user]);

    const fetchAccounts = async () => {
        try {
            const response = await api.get('/accounts');
            setAccounts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching accounts:', error);
            setLoading(false);
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
            const accountData = {
                ...formData,
                user: user._id || user.id,
                balance: parseFloat(formData.balance)
            };

            await api.post('/accounts', accountData);

            Swal.fire({
                icon: 'success',
                title: 'Account Created!',
                text: 'Your account has been added successfully',
                background: '#1a1a2e',
                color: '#fff',
                timer: 2000,
                showConfirmButton: false
            });

            setFormData({
                name: '',
                type: 'Checking',
                balance: '',
                currency: 'DT'
            });
            setShowAddForm(false);
            fetchAccounts();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to create account',
                background: '#1a1a2e',
                color: '#fff'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the account!",
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
                await api.delete(`/accounts/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Account has been deleted.',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchAccounts();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete account',
                    background: '#1a1a2e',
                    color: '#fff'
                });
            }
        }
    };

    const getTotalBalance = () => {
        return accounts.reduce((total, account) => total + (account.balance || 0), 0);
    };

    const getAccountIcon = (type) => {
        switch (type) {
            case 'Checking': return '🏦';
            case 'Savings': return '💰';
            case 'Credit Card': return '💳';
            case 'Cash': return '💵';
            default: return '🏦';
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading accounts...</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Accounts</h1>
                    <p className="page-subtitle">Total Balance: {getTotalBalance().toFixed(2)} DT</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? 'Cancel' : '+ Add Account'}
                </button>
            </div>

            {showAddForm && (
                <div className="card form-card">
                    <h2 className="card-title">New Account</h2>
                    <form onSubmit={handleSubmit} className="account-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Account Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., Main Bank Account"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="type" className="form-label">Account Type</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="Checking">Checking</option>
                                    <option value="Savings">Savings</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="balance" className="form-label">Initial Balance</label>
                                <input
                                    type="number"
                                    id="balance"
                                    name="balance"
                                    value={formData.balance}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="currency" className="form-label">Currency</label>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="DT">Tunisian Dinar (DT)</option>
                                    <option value="USD">US Dollar ($)</option>
                                    <option value="EUR">Euro (€)</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            Create Account
                        </button>
                    </form>
                </div>
            )}

            <div className="accounts-grid">
                {accounts.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">🏦</p>
                        <p className="empty-text">No accounts yet</p>
                        <p className="empty-subtext">Add your first account to start tracking your finances</p>
                    </div>
                ) : (
                    accounts.map((account) => (
                        <div key={account._id} className="account-card">
                            <div className="account-header">
                                <div className="account-icon-wrapper">
                                    <span className="account-icon">{getAccountIcon(account.type)}</span>
                                </div>
                                <button
                                    className="btn-delete-small"
                                    onClick={() => handleDelete(account._id)}
                                    title="Delete account"
                                >
                                    🗑️
                                </button>
                            </div>

                            <h3 className="account-name">{account.name}</h3>
                            <p className="account-type">{account.type}</p>

                            <div className="account-balance">
                                <span className="balance-amount">{account.balance?.toFixed(2) || '0.00'}</span>
                                <span className="balance-currency">{account.currency || 'DT'}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Accounts;
