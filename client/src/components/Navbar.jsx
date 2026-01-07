import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">💰</span>
                    <span className="logo-text">SmartWallet AI</span>
                </Link>

                <div className="navbar-menu">
                    {isAuthenticated ? (
                        <>
                            <Link to="/transactions" className="navbar-link">
                                <span className="nav-icon">💸</span>
                                <span>Transactions</span>
                            </Link>

                            <Link to="/accounts" className="navbar-link">
                                <span className="nav-icon">🏦</span>
                                <span>Accounts</span>
                            </Link>
                            <Link to="/notifications" className="navbar-link">
                                <span className="nav-icon">🔔</span>
                                <span>Notifications</span>
                            </Link>
                            <Link to="/profile" className="navbar-link navbar-profile">
                                <span className="nav-icon">👤</span>
                                <span>{user?.name || 'Profile'}</span>
                            </Link>
                            <button onClick={logout} className="btn-logout">
                                <span className="nav-icon">🚪</span>
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">
                                <span className="nav-icon">🔑</span>
                                <span>Login</span>
                            </Link>
                            <Link to="/register" className="btn-register">
                                <span className="nav-icon">✨</span>
                                <span>Get Started</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
