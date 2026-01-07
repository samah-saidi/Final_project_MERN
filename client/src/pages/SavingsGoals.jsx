import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Swal from 'sweetalert2';

const SavingsGoals = () => {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        description: ''
    });

    const goalOptions = [
        'Vacation Fund', 'Emergency Fund', 'New Car', 'House Down Payment',
        'Wedding', 'Education', 'Retirement', 'New Laptop', 'Smartphone',
        'Home Improvement', 'Investment', 'Charity', 'Debt Repayment'
    ];

    useEffect(() => {
        if (user) {
            fetchGoals();
        }
    }, [user]);

    const fetchGoals = async () => {
        try {
            const response = await api.get(`/savings-goals/user/${user._id || user.id}`);
            setGoals(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching savings goals:', error);
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
            const goalData = {
                ...formData,
                targetAmount: parseFloat(formData.targetAmount),
                currentAmount: parseFloat(formData.currentAmount) || 0
            };

            if (editingId) {
                await api.put(`/savings-goals/${editingId}`, goalData);
                Swal.fire({
                    icon: 'success',
                    title: 'Goal Updated!',
                    text: 'Your savings goal has been updated successfully',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await api.post('/savings-goals', goalData);
                Swal.fire({
                    icon: 'success',
                    title: 'Goal Created!',
                    text: 'Your savings goal has been set successfully',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            setFormData({
                name: '',
                targetAmount: '',
                currentAmount: '',
                deadline: '',
                description: ''
            });
            setShowAddForm(false);
            setEditingId(null);
            fetchGoals();
        } catch (error) {
            console.error('Goal creation/update error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} goal`,
                background: '#1a1a2e',
                color: '#fff'
            });
        }
    };

    const handleEdit = (goal) => {
        setFormData({
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount || '',
            deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
            description: goal.description || ''
        });
        setEditingId(goal._id);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the savings goal!",
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
                await api.delete(`/savings-goals/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Savings goal has been deleted.',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchGoals();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete goal',
                    background: '#1a1a2e',
                    color: '#fff'
                });
            }
        }
    };

    const calculateProgress = (goal) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        return Math.min(progress, 100);
    };

    const getDaysRemaining = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading savings goals...</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Savings Goals</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        if (showAddForm) setEditingId(null);
                        if (!showAddForm) {
                            setFormData({
                                name: '',
                                targetAmount: '',
                                currentAmount: '',
                                deadline: '',
                                description: ''
                            });
                        }
                    }}
                >
                    {showAddForm ? 'Cancel' : '+ Add Goal'}
                </button>
            </div>

            {showAddForm && (
                <div className="card form-card">
                    <h2 className="card-title">{editingId ? 'Edit Savings Goal' : 'New Savings Goal'}</h2>
                    <form onSubmit={handleSubmit} className="goal-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Goal Name</label>
                                <select
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select a Goal</option>
                                    {goalOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="targetAmount" className="form-label">Target Amount (DT)</label>
                                <input
                                    type="number"
                                    id="targetAmount"
                                    name="targetAmount"
                                    value={formData.targetAmount}
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
                                <label htmlFor="currentAmount" className="form-label">Current Amount (DT)</label>
                                <input
                                    type="number"
                                    id="currentAmount"
                                    name="currentAmount"
                                    value={formData.currentAmount}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="deadline" className="form-label">Deadline</label>
                                <input
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="form-input"
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
                                placeholder="What are you saving for?"
                                rows="3"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            {editingId ? 'Update Goal' : 'Create Goal'}
                        </button>
                    </form>
                </div>
            )}

            <div className="goals-grid">
                {goals.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">🎯</p>
                        <p className="empty-text">No savings goals yet</p>
                        <p className="empty-subtext">Set a savings goal to start working towards your dreams</p>
                    </div>
                ) : (
                    goals.map((goal) => {
                        const progress = calculateProgress(goal);
                        const isCompleted = progress >= 100;
                        const daysRemaining = goal.deadline ? getDaysRemaining(goal.deadline) : null;

                        return (
                            <div key={goal._id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
                                <div className="goal-header">
                                    <h3 className="goal-name">{goal.name}</h3>
                                    <div className="goal-actions">
                                        <button
                                            className="btn-edit-small"
                                            onClick={() => handleEdit(goal)}
                                            title="Edit goal"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-delete-small"
                                            onClick={() => handleDelete(goal._id)}
                                            title="Delete goal"
                                        >
                                            🗑️
                                        </button>
                                    </div>
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
                    })
                )}
            </div>
        </div>
    );
};

export default SavingsGoals;
