import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="profile-name">{user?.name}</h1>
                    <p className="profile-email">{user?.email}</p>
                </div>

                <div className="profile-actions">
                    <Link to="/profile/edit" className="btn btn-primary">
                        Edit Profile
                    </Link>
                </div>

                <div className="profile-info">
                    <h2 className="section-title">Account Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Member Since</span>
                            <span className="info-value">
                                {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Account Status</span>
                            <span className="info-value status-active">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
