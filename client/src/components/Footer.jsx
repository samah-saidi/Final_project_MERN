const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-title">SmartWallet AI</h3>
                    <p className="footer-description">
                        Your intelligent financial companion for smarter money management.
                    </p>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Quick Links</h4>
                    <ul className="footer-links">
                        <li><a href="/transactions">Transactions</a></li>
                        <li><a href="/budget">Budget</a></li>
                        <li><a href="/savings-goals">Savings Goals</a></li>
                        <li><a href="/accounts">Accounts</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Resources</h4>
                    <ul className="footer-links">
                        <li><a href="/categories">Categories</a></li>
                        <li><a href="/notifications">Notifications</a></li>
                        <li><a href="/profile">Profile</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Connect</h4>
                    <div className="footer-social">
                        <a href="#" className="social-link" title="Facebook">📘</a>
                        <a href="#" className="social-link" title="Twitter">🐦</a>
                        <a href="#" className="social-link" title="LinkedIn">💼</a>
                        <a href="#" className="social-link" title="Instagram">📷</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} SmartWallet AI. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
