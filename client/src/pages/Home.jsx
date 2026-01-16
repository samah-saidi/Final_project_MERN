import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Manage Your Finances with
                        <span className="gradient-text"> AI Intelligence</span>
                    </h1>
                    <p className="hero-description">
                        SmartWallet AI helps you track expenses, set savings goals, and make smarter financial decisions with the power of artificial intelligence.
                    </p>
                    <div className="hero-buttons">
                        {isAuthenticated ? (
                            <Link to="" className="btn btn-primary">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary">
                                    Get Started Free
                                </Link>
                                <Link to="/login" className="btn btn-secondary">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="hero-visual">
                    <Link to="/budget" className="floating-card card-1">
                        <span className="card-icon">📊</span>
                        <span className="card-text">Track Expenses</span>
                    </Link>
                    <Link to="" className="floating-card card-2">
                        <span className="card-icon">💎</span>
                        <span className="card-text">Save Money</span>
                    </Link>
                    <Link to="/ai-advisor" className="floating-card card-3">
                        <span className="card-icon">🤖</span>
                        <span className="card-text">AI Insights</span>
                    </Link>

                    {/* New Buttons requested by user */}
                    <Link to="/savings-goals" className="floating-card card-4">
                        <span className="card-icon">🎯</span>
                        <span className="card-text">Savings Goals</span>
                    </Link>
                    <Link to="/categories" className="floating-card card-5">
                        <span className="card-icon">📁</span>
                        <span className="card-text">Categories</span>
                    </Link>
                    <Link to="/bi-dashboard" className="floating-card card-6">
                        <span className="card-icon">📈</span>
                        <span className="card-text">BI Dashboard</span>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2 className="section-title">Why Choose SmartWallet AI?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">💰</div>
                        <h3 className="feature-title">Smart Budgeting</h3>
                        <p className="feature-description">
                            AI-powered budget recommendations based on your spending patterns and financial goals.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📈</div>
                        <h3 className="feature-title">Expense Tracking</h3>
                        <p className="feature-description">
                            Automatically categorize and track your expenses with intelligent insights.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3 className="feature-title">Savings Goals</h3>
                        <p className="feature-description">
                            Set and achieve your financial goals with personalized savings strategies.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3 className="feature-title">Secure & Private</h3>
                        <p className="feature-description">
                            Your financial data is encrypted and protected with bank-level security.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3 className="feature-title">Mobile Ready</h3>
                        <p className="feature-description">
                            Access your wallet anywhere, anytime with our responsive design.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3 className="feature-title">Real-time Updates</h3>
                        <p className="feature-description">
                            Get instant notifications and updates on your financial activities.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Take Control of Your Finances?</h2>
                    <p className="cta-description">
                        Join thousands of users who are already managing their money smarter with SmartWallet AI.
                    </p>
                    {!isAuthenticated && (
                        <Link to="/register" className="btn btn-primary btn-large">
                            Start Your Journey Today
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
