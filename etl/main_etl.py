from config.database import DatabaseConnections
from extractors.mongo_extractor import MongoExtractor
from transformers.data_transformer import DataTransformer
from loaders.warehouse_loader import WarehouseLoader
from datetime import datetime
import traceback

def main():
    print("=" * 60)
    print("PROCESSUS ETL - SmartWallet Data Warehouse")
    print("=" * 60)
    start_time = datetime.now()
    
    # Connexions
    try:
        db_conn = DatabaseConnections()
    except Exception as e:
        print(f"\nError: Impossible de se connecter aux bases de donnees: {e}")
        return
    
    try:
        # ========== EXTRACT ==========
        print("\n" + "=" * 60)
        print("PHASE 1: EXTRACTION DES DONNEES")
        print("=" * 60)
        
        extractor = MongoExtractor(db_conn.mongo_db)
        
        print("\n- Extraction des utilisateurs...")
        df_users = extractor.extract_users()
        print(f"   Utilisateurs extraits: {len(df_users)}")
        
        print("\n- Extraction des categories...")
        df_categories = extractor.extract_categories()
        print(f"   Categories extraites: {len(df_categories)}")
        
        print("\n- Extraction des comptes...")
        df_accounts = extractor.extract_accounts()
        print(f"   Comptes extraits: {len(df_accounts)}")
        
        print("\n- Extraction des transactions...")
        df_transactions = extractor.extract_transactions()
        print(f"   Transactions extraites: {len(df_transactions)}")
        
        print("\n- Extraction des budgets...")
        df_budgets = extractor.extract_budgets()
        print(f"   Budgets extraits: {len(df_budgets)}")
        
        print("\n- Extraction des objectifs d'epargne...")
        df_goals = extractor.extract_savings_goals()
        print(f"   Objectifs extraits: {len(df_goals)}")
        
        # ========== TRANSFORM ==========
        print("\n" + "=" * 60)
        print("PHASE 2: TRANSFORMATION DES DONNEES")
        print("=" * 60)
        
        transformer = DataTransformer()
        
        print("\n- Transformation des utilisateurs...")
        df_users_clean = transformer.clean_users(df_users)
        print(f"   Utilisateurs transformes: {len(df_users_clean)}")
        
        print("\n- Transformation des categories...")
        df_categories_clean = transformer.clean_categories(df_categories)
        print(f"   Categories transformees: {len(df_categories_clean)}")
        
        print("\n- Transformation des comptes...")
        df_accounts_clean = transformer.clean_accounts(df_accounts)
        print(f"   Comptes transformes: {len(df_accounts_clean)}")
        
        print("\n- Transformation des transactions...")
        df_transactions_clean = transformer.transform_transactions(df_transactions)
        print(f"   Transactions transformees: {len(df_transactions_clean)}")
        
        print("\n- Transformation des budgets...")
        df_budgets_clean = transformer.transform_budgets(df_budgets)
        print(f"   Budgets transformes: {len(df_budgets_clean)}")
        
        print("\n- Transformation des objectifs d'epargne...")
        df_goals_clean = transformer.transform_savings_goals(df_goals)
        print(f"   Objectifs transformes: {len(df_goals_clean)}")
        
        print("\n- Generation de la dimension temps...")
        df_date = transformer.generate_date_dimension()
        print(f"   Dimension temps generee: {len(df_date)} jours")
        
        # ========== LOAD ==========
        print("\n" + "=" * 60)
        print("PHASE 3: CHARGEMENT DANS LE DATA WAREHOUSE")
        print("=" * 60)
        
        loader = WarehouseLoader(db_conn.mysql_cursor, db_conn.mysql_conn)
        
        print("\n- Chargement de la dimension temps...")
        loader.load_dim_date(df_date)
        
        print("\n- Chargement de la dimension utilisateur...")
        loader.load_dim_user(df_users_clean)
        
        print("\n- Chargement de la dimension categorie...")
        loader.load_dim_category(df_categories_clean)
        
        print("\n- Chargement de la dimension compte...")
        loader.load_dim_account(df_accounts_clean)
        
        print("\n- Chargement de la table de faits transactions...")
        loader.load_fact_transaction(df_transactions_clean)
        
        print("\n- Chargement de la table de faits budgets...")
        loader.load_fact_budget(df_budgets_clean)
        
        print("\n- Chargement de la table de faits objectifs d'epargne...")
        loader.load_fact_savings_goal(df_goals_clean)
        
        # ========== FIN ==========
        duration = (datetime.now() - start_time).total_seconds()
        
        print("\n" + "=" * 60)
        print("ETL TERMINE AVEC SUCCES")
        print("=" * 60)
        print(f"Duree totale: {duration:.2f} secondes")
        print(f"Transactions chargees: {len(df_transactions_clean)}")
        +
        # Enregistrer dans les metadonnees
        loader.save_etl_metadata('success', len(df_transactions_clean))
        
    except Exception as e:
        print("\n" + "=" * 60)
        print("ERREUR LORS DU PROCESSUS ETL")
        print("=" * 60)
        print(f"Erreur: {str(e)}")
        traceback.print_exc()
        
        # Enregistrer l'erreur
        try:
            loader.save_etl_metadata('failed', 0, str(e))
        except:
            pass
        
    finally:
        db_conn.close_connections()
        print("\n" + "=" * 60)

if __name__ == "__main__":
    main()