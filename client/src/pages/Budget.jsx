import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Swal from 'sweetalert2';

const Budget = () => {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        period: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchBudgets(), fetchCategories()]);
        setLoading(false);
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get(`/categories/user/${user._id || user.id}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBudgets = async () => {
        try {
            const userId = user._id || user.id;
            const response = await api.get(`/budgets/user/${userId}`);
            setBudgets(response.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
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
            const budgetData = {
                ...formData,
                user: user._id || user.id,
                amount: parseFloat(formData.amount)
            };

            if (editingId) {
                await api.put(`/budgets/${editingId}`, budgetData);
                Swal.fire({
                    icon: 'success',
                    title: 'Budget mis à jour !',
                    text: 'Votre budget a été modifié avec succès',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await api.post('/budgets', budgetData);
                Swal.fire({
                    icon: 'success',
                    title: 'Budget créé !',
                    text: 'Votre budget a été défini avec succès',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            setFormData({
                category: '',
                amount: '',
                period: 'Monthly',
                startDate: new Date().toISOString().split('T')[0],
                endDate: ''
            });
            setShowAddForm(false);
            setEditingId(null);
            fetchBudgets();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.response?.data?.message || `Échec de la ${editingId ? 'mise à jour' : 'création'} du budget`,
                background: '#1a1a2e',
                color: '#fff'
            });
        }
    };

    const handleEdit = (budget) => {
        setFormData({
            category: budget.category?._id || budget.category,
            amount: budget.amount,
            period: budget.period,
            startDate: budget.startDate ? budget.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
            endDate: budget.endDate ? budget.endDate.split('T')[0] : ''
        });
        setEditingId(budget._id);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will remove the budget limit!",
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
                await api.delete(`/budgets/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Budget has been removed.',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchBudgets();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete budget',
                    background: '#1a1a2e',
                    color: '#fff'
                });
            }
        }
    };

    const calculateProgress = (budget) => {
        // This would need actual spending data from transactions
        // For now, using a placeholder
        const spent = budget.spent || 0;
        const percentage = (spent / budget.amount) * 100;
        return Math.min(percentage, 100);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading budgets...</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Gestion du Budget</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        if (showAddForm) setEditingId(null);
                        if (!showAddForm) {
                            setFormData({
                                category: '',
                                amount: '',
                                period: 'Monthly',
                                startDate: new Date().toISOString().split('T')[0],
                                endDate: ''
                            });
                        }
                    }}
                >
                    {showAddForm ? 'Annuler' : '+ Créer un Budget'}
                </button>
            </div>

            {showAddForm && (
                <div className="card form-card">
                    <h2 className="card-title">{editingId ? 'Modifier le Budget' : 'Nouveau Budget'}</h2>
                    <form onSubmit={handleSubmit} className="budget-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="category" className="form-label">Catégorie</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Sélectionnez une catégorie</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="amount" className="form-label">Montant du budget (DT)</label>
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
                                <label htmlFor="period" className="form-label">Période</label>
                                <select
                                    id="period"
                                    name="period"
                                    value={formData.period}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="Weekly">Hebdomadaire (par semaine)</option>
                                    <option value="Monthly">Mensuel (par mois)</option>
                                    <option value="Yearly">Annuel (par an)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="startDate" className="form-label">Date de début</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            {editingId ? 'Mettre à jour le Budget' : 'Créer le Budget'}
                        </button>
                    </form>
                </div>
            )}

            <div className="budgets-grid">
                {budgets.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">📊</p>
                        <p className="empty-text">Aucun budget défini</p>
                        <p className="empty-subtext">Créez un budget pour suivre vos limites de d\u00e9penses</p>
                    </div>
                ) : (
                    budgets.map((budget) => {
                        const progress = calculateProgress(budget);
                        const isOverBudget = progress >= 100;
                        const categoryName = budget.category?.name || 'Uncategorized';

                        return (
                            <div key={budget._id} className="budget-card">
                                <div className="budget-header">
                                    <h3 className="budget-category">
                                        {budget.category?.icon} {categoryName}
                                    </h3>
                                    <div className="goal-actions">
                                        <button
                                            className="btn-edit-small"
                                            onClick={() => handleEdit(budget)}
                                            title="Modifier le budget"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-delete-small"
                                            onClick={() => handleDelete(budget._id)}
                                            title="Supprimer le budget"
                                        >
                                            🗑️
                                        </button>
                                    </div>
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
                                        {isOverBudget ? '⚠️ Budget dépassé' : '✓ Dans les limites'}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Budget;
