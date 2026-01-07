import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Swal from 'sweetalert2';

const ProfileEdit = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        occupation: '',
        currency: 'DT'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.profile?.phone || '',
                address: user.profile?.address || '',
                occupation: user.profile?.occupation || '',
                currency: user.profile?.currency || 'DT'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Update basic user info and profile info
            const response = await api.put(`/users/profile`, formData);

            if (response.data) {
                // Update local auth state if necessary
                const updatedUser = { ...user, name: formData.name, email: formData.email, profile: response.data.profile };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // update auth context so UI reflects changes immediately
                if (setUser) setUser(updatedUser);

                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated',
                    text: 'Your profile has been updated successfully!',
                    background: '#1a1a2e',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });

                navigate('/profile');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'Something went wrong',
                background: '#1a1a2e',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card profile-edit-card">
                <div className="auth-header">
                    <h1 className="auth-title">Edit Profile</h1>
                    <p className="auth-subtitle">Keep your information up to date</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group-grid">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Your full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Your phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="occupation" className="form-label">Occupation</label>
                            <input
                                type="text"
                                id="occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="What do you do?"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Where do you live?"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="currency" className="form-label">Preferred Currency</label>
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

                    <div className="auth-buttons">
                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/profile')}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEdit;
