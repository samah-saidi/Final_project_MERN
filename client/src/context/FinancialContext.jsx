import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from "../api/axios";
import { useAuth } from './AuthContext';

const FinancialContext = createContext();

export const useFinancial = () => {
    const context = useContext(FinancialContext);
    if (!context) {
        throw new Error('useFinancial must be used within a FinancialProvider');
    }
    return context;
};

export const FinancialProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshData = useCallback(async () => {
        if (!isAuthenticated || !user) return;

        setLoading(true);
        setError(null);
        try {
            const [transRes, budgetsRes, accountsRes] = await Promise.all([
                api.get(`/transactions/user/${user.id}`),
                api.get(`/budgets/user/${user.id}`),
                api.get('/accounts')
            ]);

            setTransactions(transRes.data);
            setBudgets(budgetsRes.data);
            setAccounts(accountsRes.data);
        } catch (err) {
            console.error("Error refreshing financial data:", err);
            setError(err.response?.data?.message || "Failed to fetch financial data");
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (isAuthenticated) {
            refreshData();
        } else {
            setTransactions([]);
            setBudgets([]);
            setAccounts([]);
        }
    }, [isAuthenticated, refreshData]);

    const addTransaction = async (data) => {
        try {
            const res = await api.post('/transactions', data);
            setTransactions(prev => [res.data, ...prev]);
            // Refresh budgets since spent amount might change
            const budgetRes = await api.get(`/budgets/user/${user.id}`);
            setBudgets(budgetRes.data);
            return { success: true, data: res.data };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Failed to add transaction" };
        }
    };

    const value = {
        transactions,
        budgets,
        accounts,
        loading,
        error,
        refreshData,
        addTransaction
    };

    return (
        <FinancialContext.Provider value={value}>
            {children}
        </FinancialContext.Provider>
    );
};
