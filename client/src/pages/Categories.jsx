import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Swal from 'sweetalert2';

const Categories = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Expense',
        icon: '📦',
        color: '#667eea'
    });

    const iconOptions = ['🍔', '🚗', '🏠', '💼', '🎮', '🎬', '🛒', '💊', '✈️', '📚', '💰', '🎁', '⚡', '📦'];
    const colorOptions = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];
    const commonCategories = [
        'Food & Dining', 'Transportation', 'Housing', 'Utilities',
        'Entertainment', 'Shopping', 'Healthcare', 'Education',
        'Travel', 'Personal Care', 'Gifts', 'Investments', 'Salary', 'Freelance'
    ];

    useEffect(() => {
        if (user) {
            fetchCategories();
        }
    }, [user]);

    const fetchCategories = async () => {
        try {
            const response = await api.get(`/categories/user/${user._id || user.id}`);
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
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
            if (editingId) {
                await api.put(`/categories/${editingId}`, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Category Updated!',
                    text: 'Your category has been modified successfully',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await api.post('/categories', formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Category Created!',
                    text: 'Your category has been added successfully',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            setFormData({
                name: '',
                type: 'Expense',
                icon: '📦',
                color: '#667eea'
            });
            setShowAddForm(false);
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            console.error('Category error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message || `Failed to ${editingId ? 'update' : 'create'} category`,
                background: '#1a1a2e',
                color: '#fff'
            });
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            type: category.type,
            icon: category.icon || '📦',
            color: category.color || '#667eea'
        });
        setEditingId(category._id);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the category!",
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
                await api.delete(`/categories/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Category has been deleted.',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchCategories();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete category',
                    background: '#1a1a2e',
                    color: '#fff'
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading categories...</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Categories</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        if (showAddForm) setEditingId(null);
                        if (!showAddForm) {
                            setFormData({
                                name: '',
                                type: 'Expense',
                                icon: '📦',
                                color: '#667eea'
                            });
                        }
                    }}
                >
                    {showAddForm ? 'Cancel' : '+ Add Category'}
                </button>
            </div>

            {showAddForm && (
                <div className="card form-card">
                    <h2 className="card-title">{editingId ? 'Edit Category' : 'New Category'}</h2>
                    <form onSubmit={handleSubmit} className="category-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Category Name</label>
                                <select
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select Category Name</option>
                                    {commonCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    <option value="Other">Other</option>
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
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Icon</label>
                            <div className="icon-picker">
                                {iconOptions.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                                        onClick={() => setFormData({ ...formData, icon })}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Color</label>
                            <div className="color-picker">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`color-option ${formData.color === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData({ ...formData, color })}
                                    />
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            {editingId ? 'Update Category' : 'Create Category'}
                        </button>
                    </form>
                </div>
            )}

            <div className="categories-grid">
                {categories.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">📁</p>
                        <p className="empty-text">No categories yet</p>
                        <p className="empty-subtext">Create categories to organize your transactions and budgets</p>
                    </div>
                ) : (
                    categories.map((category) => (
                        <div key={category._id} className="category-card" style={{ borderLeftColor: category.color }}>
                            <div className="category-icon" style={{ backgroundColor: category.color }}>
                                {category.icon || '📦'}
                            </div>
                            <div className="category-details">
                                <h3 className="category-name">{category.name}</h3>
                                <span className="category-type">{category.type}</span>
                            </div>
                            <div className="goal-actions">
                                <button
                                    className="btn-edit-small"
                                    onClick={() => handleEdit(category)}
                                    title="Edit category"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn-delete-small"
                                    onClick={() => handleDelete(category._id)}
                                    title="Delete category"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Categories;
