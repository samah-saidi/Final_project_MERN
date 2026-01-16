import { Routes, Route } from 'react-router-dom';
import './App.css';
import { FinancialProvider } from './context/FinancialContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Categories from './pages/Categories';
import Accounts from './pages/Accounts';
import SavingsGoals from './pages/SavingsGoals';
import Notifications from './pages/Notifications';
import AIAdvisor from './pages/AIAdvisor';
import AIChatbot from './components/AIChatbot';
import DashboardBI from './pages/DashboardBI';
import NotFound from './pages/NotFound';

function App() {
  return (
    <FinancialProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <Budget />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />

          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <Accounts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/savings-goals"
            element={
              <ProtectedRoute>
                <SavingsGoals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-advisor"
            element={
              <ProtectedRoute>
                <AIAdvisor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bi-dashboard"
            element={
              <ProtectedRoute>
                <DashboardBI />
              </ProtectedRoute>
            }
          />

          {/* 404 - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatbot />
        <Footer />
      </div>
    </FinancialProvider>
  );
}

export default App;