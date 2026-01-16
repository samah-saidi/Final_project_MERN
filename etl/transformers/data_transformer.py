import pandas as pd
from datetime import datetime

class DataTransformer:
    
    @staticmethod
    def clean_users(df_users):
        """Nettoyer et transformer les données utilisateurs"""
        if df_users.empty:
            return df_users
        
        # Supprimer les doublons
        df_users = df_users.drop_duplicates(subset=['user_id'])
        
        # Gérer les valeurs manquantes
        if 'full_name' in df_users.columns:
            df_users['full_name'].fillna('Unknown', inplace=True)
        
        if 'email' in df_users.columns:
            df_users['email'].fillna('no-email@example.com', inplace=True)
        
        # Extraire la date d'inscription
        if 'createdAt' in df_users.columns:
            df_users['registration_date'] = pd.to_datetime(df_users['createdAt']).dt.date
        elif 'created_at' in df_users.columns:
            df_users['registration_date'] = pd.to_datetime(df_users['created_at']).dt.date
        else:
            df_users['registration_date'] = datetime.now().date()
        
        # Gérer le pays
        if 'country' not in df_users.columns:
            df_users['country'] = 'Unknown'
        
        # Sélectionner uniquement les colonnes nécessaires
        required_columns = ['user_id', 'full_name', 'email', 'registration_date', 'country']
        existing_columns = [col for col in required_columns if col in df_users.columns]
        
        return df_users[existing_columns]
    
    @staticmethod
    def clean_categories(df_categories):
        """Nettoyer et transformer les catégories"""
        if df_categories.empty:
            return df_categories
        
        df_categories = df_categories.drop_duplicates(subset=['category_id'])
        
        if 'category_name' in df_categories.columns:
            df_categories['category_name'].fillna('Uncategorized', inplace=True)
        
        if 'category_type' in df_categories.columns:
            df_categories['category_type'].fillna('other', inplace=True)
        
        # Ajouter une icône par défaut si elle n'existe pas
        if 'icon' not in df_categories.columns:
            df_categories['icon'] = '📁'
        
        required_columns = ['category_id', 'category_name', 'category_type', 'icon']
        existing_columns = [col for col in required_columns if col in df_categories.columns]
        
        return df_categories[existing_columns]
    
    @staticmethod
    def clean_accounts(df_accounts):
        """Nettoyer et transformer les comptes"""
        if df_accounts.empty:
            return df_accounts
        
        df_accounts = df_accounts.drop_duplicates(subset=['account_id'])
        
        # Valeurs par défaut
        if 'account_name' in df_accounts.columns:
            df_accounts['account_name'].fillna('Compte Principal', inplace=True)
        
        if 'account_type' not in df_accounts.columns:
            df_accounts['account_type'] = 'Courant'
        
        if 'institution' not in df_accounts.columns:
            df_accounts['institution'] = 'Banque Inconnue'
        
        if 'currency' not in df_accounts.columns:
            df_accounts['currency'] = 'TND'
        
        if 'isActive' in df_accounts.columns:
            df_accounts['is_active'] = df_accounts['isActive']
        elif 'is_active' not in df_accounts.columns:
            df_accounts['is_active'] = True
        
        required_columns = ['account_id', 'account_name', 'account_type', 'institution', 'currency', 'is_active']
        existing_columns = [col for col in required_columns if col in df_accounts.columns]
        
        return df_accounts[existing_columns]
    
    @staticmethod
    def transform_transactions(df_transactions):
        """Transformer les transactions pour la table de faits"""
        if df_transactions.empty:
            return df_transactions
        
        # Créer la clé de date (format: YYYYMMDD)
        if 'date' in df_transactions.columns:
            df_transactions['date_key'] = pd.to_datetime(df_transactions['date']).dt.strftime('%Y%m%d').astype(int)
        else:
            df_transactions['date_key'] = int(datetime.now().strftime('%Y%m%d'))
        
        # Déterminer si c'est un revenu ou une dépense
        if 'type' in df_transactions.columns:
            df_transactions['is_income'] = df_transactions['type'] == 'income'
        else:
            df_transactions['is_income'] = False
        
        # S'assurer que le montant est numérique
        if 'amount' in df_transactions.columns:
            df_transactions['amount'] = pd.to_numeric(df_transactions['amount'], errors='coerce')
            # Supprimer les transactions avec montant invalide
            df_transactions = df_transactions[df_transactions['amount'].notna()]
        
        required_columns = ['user_id', 'category_id', 'account_id', 'date_key', 'amount', 'is_income']
        existing_columns = [col for col in required_columns if col in df_transactions.columns]
        
        return df_transactions[existing_columns]
    
    @staticmethod
    def generate_date_dimension(start_date='2020-01-01', end_date='2030-12-31'):
        """Générer la dimension temps"""
        dates = pd.date_range(start=start_date, end=end_date, freq='D')
        
        df_date = pd.DataFrame({
            'date_key': dates.strftime('%Y%m%d').astype(int),
            'full_date': dates.date,
            'day': dates.day,
            'month': dates.month,
            'year': dates.year,
            'day_of_week': dates.dayofweek,
            'day_name': dates.day_name(),
            'month_name': dates.month_name(),
            'quarter': dates.quarter,
            'is_weekend': dates.dayofweek.isin([5, 6])
        })
        
        return df_date

    @staticmethod
    def transform_budgets(df_budgets):
        """Transformer les budgets pour la table de faits"""
        if df_budgets.empty:
            return df_budgets
        
        # S'assurer que les montants sont numériques
        df_budgets['amount'] = pd.to_numeric(df_budgets['amount'], errors='coerce')
        df_budgets['spent'] = pd.to_numeric(df_budgets.get('spent', 0), errors='coerce').fillna(0)
        
        # Gérer is_active
        if 'isActive' in df_budgets.columns:
            df_budgets['is_active'] = df_budgets['isActive']
        elif 'is_active' not in df_budgets.columns:
            df_budgets['is_active'] = True
            
        required_columns = ['user_id', 'category_id', 'amount', 'spent', 'period', 'is_active']
        existing_columns = [col for col in required_columns if col in df_budgets.columns]
        
        return df_budgets[existing_columns]

    @staticmethod
    def transform_savings_goals(df_goals):
        """Transformer les objectifs d'épargne pour la table de faits"""
        if df_goals.empty:
            return df_goals
        
        # S'assurer que les montants sont numériques
        df_goals['target_amount'] = pd.to_numeric(df_goals['targetAmount'], errors='coerce')
        df_goals['current_amount'] = pd.to_numeric(df_goals.get('currentAmount', 0), errors='coerce').fillna(0)
        
        # Créer la clé de deadline (format: YYYYMMDD)
        if 'deadline' in df_goals.columns:
            df_goals['deadline_key'] = pd.to_datetime(df_goals['deadline']).dt.strftime('%Y%m%d').astype(int)
        else:
            df_goals['deadline_key'] = None
            
        # Renommer goal_name
        if 'name' in df_goals.columns:
            df_goals['goal_name'] = df_goals['name']
            
        required_columns = ['user_id', 'goal_name', 'target_amount', 'current_amount', 'priority', 'deadline_key']
        existing_columns = [col for col in required_columns if col in df_goals.columns]
        
        return df_goals[existing_columns]